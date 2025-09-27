"""
pipeline.py

Usage:
    python pipeline.py /path/to/holdings.txt [monthA] [monthB]

If monthA and monthB are not provided, defaults to:
    monthA = "2025-05-31"
    monthB = "2025-08-31"

Outputs:
Step 1 (validation stage):
- validation_totals.csv
- isin_mapping.csv
- namecut_multiple_standard_names.csv
- namecut_multiple_isins.csv

Step 2 (after user confirmation):
- summary_by_standardized_name.csv

Notes:
- Percentages are FRACTIONS (e.g., 0.25 = 25%).
- ISINs are always assumed present.
- Standardized names always taken from INSTRUMENT_NAME (fallback COMPANY_NAME_STD).
- `comments` column included (max 75 chars).
"""

import sys
import re
import pandas as pd
import numpy as np
from pathlib import Path

# -------------------------
# Helpers
# -------------------------
def safe_read_csv(path, **kwargs):
    return pd.read_csv(path, **kwargs).fillna("")

def format_number(val):
    """Format numbers with commas, no decimals, no scientific notation."""
    try:
        return f"{int(round(float(val))):,}"
    except:
        return str(val)

def markdown_table(df):
    """Convert DataFrame to markdown table with formatted numbers."""
    df_fmt = df.copy()
    for col in df_fmt.columns:
        if pd.api.types.is_numeric_dtype(df_fmt[col]):
            df_fmt[col] = df_fmt[col].apply(format_number)
    return df_fmt.to_markdown(index=False)

# -------------------------
# Step 1: Validation outputs
# -------------------------
def run_validation(upload_path: str, monthA: str, monthB: str, outdir="."):
    df = safe_read_csv(upload_path, sep="|", dtype=str)
    df["MARKET_VALUE"] = pd.to_numeric(df.get("MARKET_VALUE", 0), errors="coerce").fillna(0.0)
    df["QUANTITY"] = pd.to_numeric(df.get("QUANTITY", 0), errors="coerce").fillna(0.0)

    outdir = Path(outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    # Show 3 random rows for preview
    print("\n📊 Sample rows from uploaded file:")
    print(df.sample(min(3, len(df))).to_markdown(index=False))

    # 1) validation_totals.csv
    agg = df.groupby(["SCHEME_NAME", "MONTH_END"]).agg(
        mv_sum=("MARKET_VALUE", "sum"),
        qty_sum=("QUANTITY", "sum")
    ).reset_index()

    mv_pivot = agg.pivot(index="SCHEME_NAME", columns="MONTH_END", values="mv_sum").fillna(0).reset_index()
    qty_pivot = agg.pivot(index="SCHEME_NAME", columns="MONTH_END", values="qty_sum").fillna(0).reset_index()

    rows = []
    for _, r in mv_pivot.iterrows():
        rows.append({"metric": f"{r['SCHEME_NAME']} - Market Value", monthA: r.get(monthA, 0.0), monthB: r.get(monthB, 0.0)})
    for _, r in qty_pivot.iterrows():
        rows.append({"metric": f"{r['SCHEME_NAME']} - Quantity", monthA: r.get(monthA, 0.0), monthB: r.get(monthB, 0.0)})

    validation_totals = pd.DataFrame(rows)
    validation_totals.to_csv(outdir / "validation_totals.csv", index=False)

    # Show as markdown table
    print("\n📑 Validation Totals (Markdown Table):")
    print(markdown_table(validation_totals))

    # 2) isin_mapping.csv
    def pick_name(row):
        if str(row.get("INSTRUMENT_NAME", "")).strip():
            return str(row.get("INSTRUMENT_NAME", ""))
        return str(row.get("COMPANY_NAME_STD", ""))

    isin_records = []
    for isin, group in df.groupby("ISIN"):
        chosen = ""
        for _, r in group.iterrows():
            chosen = pick_name(r)
            if chosen:
                break
        std_disp = re.sub(r"\s+", " ", chosen).strip()
        std_key = re.sub(r"[^a-z0-9]", "", std_disp.lower())
        isin_records.append({
            "ISIN": isin,
            "standardized_name_display": std_disp,
            "standardized_name_key": std_key,
            "name_cut": std_key[:7],
            "comments": ""  # always include comments column
        })
    isin_map = pd.DataFrame(isin_records)
    isin_map.to_csv(outdir / "isin_mapping.csv", index=False)

    # 3) namecut_multiple_standard_names.csv
    rows_multi_name = []
    for name_cut, g in isin_map.groupby("name_cut"):
        names = g["standardized_name_display"].unique().tolist()
        if len(names) > 1:
            for nm in names:
                rows_multi_name.append({"name_cut": name_cut, "standardized_name_display": nm})
    multi_name_df = pd.DataFrame(rows_multi_name)
    multi_name_df.to_csv(outdir / "namecut_multiple_standard_names.csv", index=False)

    # 4) namecut_multiple_isins.csv
    rows_multi_isin = []
    for name_cut, g in isin_map.groupby("name_cut"):
        isins = g["ISIN"].unique().tolist()
        if len(isins) > 1:
            for isin in isins:
                nm = g[g["ISIN"] == isin]["standardized_name_display"].iloc[0]
                rows_multi_isin.append({"name_cut": name_cut, "ISIN": isin, "standardized_name_display": nm})
    multi_isin_df = pd.DataFrame(rows_multi_isin)
    multi_isin_df.to_csv(outdir / "namecut_multiple_isins.csv", index=False)

    return {
        "validation_totals": str(outdir / "validation_totals.csv"),
        "isin_mapping": str(outdir / "isin_mapping.csv"),
        "multi_name": str(outdir / "namecut_multiple_standard_names.csv"),
        "multi_isin": str(outdir / "namecut_multiple_isins.csv")
    }

# -------------------------
# Step 2: Summary
# -------------------------
def run_summary(upload_path: str, isin_mapping_path: str, monthA: str, monthB: str, outdir="."):
    df = safe_read_csv(upload_path, sep="|", dtype=str)
    df["MARKET_VALUE"] = pd.to_numeric(df.get("MARKET_VALUE", 0), errors="coerce").fillna(0.0)
    df["QUANTITY"] = pd.to_numeric(df.get("QUANTITY", 0), errors="coerce").fillna(0.0)

    isin_map = safe_read_csv(isin_mapping_path, dtype=str)
    isin_map["comments"] = isin_map["comments"].astype(str).str.slice(0, 75)  # enforce max length

    merged = df.merge(isin_map[["ISIN", "standardized_name_display", "comments"]], on="ISIN", how="left")

    # Aggregate Market Value
    agg_mv = merged.groupby(["standardized_name_display", "MONTH_END"]).agg(
        mv_sum=("MARKET_VALUE", "sum")
    ).reset_index()
    mv_pivot = agg_mv.pivot(index="standardized_name_display", columns="MONTH_END", values="mv_sum").fillna(0).reset_index()
    mv_pivot = mv_pivot.rename(columns={monthA: "Jul_2025", monthB: "Aug_2025"})

    # Aggregate Quantity
    agg_qty = merged.groupby(["standardized_name_display", "MONTH_END"]).agg(
        qty_sum=("QUANTITY", "sum")
    ).reset_index()
    qty_pivot = agg_qty.pivot(index="standardized_name_display", columns="MONTH_END", values="qty_sum").fillna(0).reset_index()
    qty_pivot = qty_pivot.rename(columns={monthA: "Jul_2025_qty", monthB: "Aug_2025_qty"})

    # Merge MV and Qty
    summary = mv_pivot.merge(qty_pivot, on="standardized_name_display", how="outer")

    # Fractions and changes
    summary["mv_jul_pct"] = summary["Jul_2025"] / (summary["Jul_2025"].sum() or 1)
    summary["mv_aug_pct"] = summary["Aug_2025"] / (summary["Aug_2025"].sum() or 1)

    def frac(new, old):
        return np.nan if old == 0 else new / old - 1

    summary["mv_pct_change"] = summary.apply(lambda r: frac(r["Aug_2025"], r["Jul_2025"]), axis=1)
    summary["qty_pct_change"] = summary.apply(lambda r: frac(r["Aug_2025_qty"], r["Jul_2025_qty"]), axis=1)

    # MF counts
    scheme_agg = merged.groupby(["standardized_name_display", "SCHEME_NAME", "MONTH_END"]).agg(
        mv_sum=("MARKET_VALUE", "sum"), qty_sum=("QUANTITY", "sum")
    ).reset_index()
    mf_count_mv_jul = scheme_agg[(scheme_agg["MONTH_END"] == monthA) & (scheme_agg["mv_sum"] > 0)].groupby("standardized_name_display")["SCHEME_NAME"].nunique()
    mf_count_mv_aug = scheme_agg[(scheme_agg["MONTH_END"] == monthB) & (scheme_agg["mv_sum"] > 0)].groupby("standardized_name_display")["SCHEME_NAME"].nunique()
    mf_count_qty_jul = scheme_agg[(scheme_agg["MONTH_END"] == monthA) & (scheme_agg["qty_sum"] > 0)].groupby("standardized_name_display")["SCHEME_NAME"].nunique()
    mf_count_qty_aug = scheme_agg[(scheme_agg["MONTH_END"] == monthB) & (scheme_agg["qty_sum"] > 0)].groupby("standardized_name_display")["SCHEME_NAME"].nunique()

    summary = summary.set_index("standardized_name_display")
    summary["Num of MF Jul - MV"] = mf_count_mv_jul
    summary["Num of MF Aug - MV"] = mf_count_mv_aug
    summary["Num of MF Jul - Qty"] = mf_count_qty_jul
    summary["Num of MF Aug - Qty"] = mf_count_qty_aug
    summary = summary.fillna(0).reset_index()

    # Reorder and rename columns
    final = summary.rename(columns={
        "standardized_name_display": "Name",
        "mv_jul_pct": "Mkt. Val Jul - %",
        "mv_aug_pct": "Mkt. Val Aug - %",
        "mv_pct_change": "MV % Change",
        "qty_pct_change": "Qty % Change",
        "Jul_2025": "Mkt Val. Jul 2025",
        "Aug_2025": "Mkt Val. Aug 2025",
        "Jul_2025_qty": "Qty Jul 2025",
        "Aug_2025_qty": "Qty Aug 2025"
    })

    # Always include Comment column
    if "comments" in isin_map.columns:
        final = final.merge(isin_map[["standardized_name_display", "comments"]].drop_duplicates(),
                            left_on="Name", right_on="standardized_name_display", how="left")
        final = final.drop(columns=["standardized_name_display"])
        final = final.rename(columns={"comments": "Comment"})
    else:
        final["Comment"] = ""

    final = final[[
        "Name", "Mkt. Val Jul - %", "Mkt. Val Aug - %", "MV % Change", "Qty % Change",
        "Num of MF Jul - MV", "Num of MF Aug - MV", "Num of MF Jul - Qty", "Num of MF Aug - Qty",
        "Mkt Val. Jul 2025", "Mkt Val. Aug 2025", "Qty Jul 2025", "Qty Aug 2025", "Comment"
    ]]

    summary_path = Path(outdir) / "summary_by_standardized_name.csv"
    final.to_csv(summary_path, index=False)
    return str(summary_path)

# -------------------------
# Driver
# -------------------------
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python pipeline.py /path/to/file.txt [monthA] [monthB]")
        sys.exit(1)

    upload_path = sys.argv[1]
    monthA = sys.argv[2] if len(sys.argv) > 2 else "2025-05-31"
    monthB = sys.argv[3] if len(sys.argv) > 3 else "2025-08-31"

    print(f"▶ Using periods: {monthA} vs {monthB}")

    run_validation(upload_path, monthA, monthB)
    print("\n✅ Validation complete. Please review CSVs and confirm before running summary.")
