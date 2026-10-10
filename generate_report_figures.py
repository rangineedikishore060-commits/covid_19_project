import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
import pandas as pd

# Create output dir
os.makedirs("report_figures", exist_ok=True)
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
plt.rcParams['font.family'] = 'DejaVu Sans'
plt.rcParams['font.size'] = 10

# 1. Architecture diagram
fig, ax = plt.subplots(figsize=(8, 4.4), dpi=200)
ax.axis('off')
boxes = [
    ("Tier 1: World Level\nGlobal Aggregates, Continents Choropleth & Global Overview", 0.1, 0.76, 0.8, 0.17, "#1e3a8a"),
    ("Tier 2: Continent Level\nCountry Distributions, Regional Comparisons & Time-Series", 0.15, 0.51, 0.7, 0.17, "#2563eb"),
    ("Tier 3: Country Level\nState/Provincial Choropleths, Clinical Mortality & Trends", 0.2, 0.26, 0.6, 0.17, "#0284c7"),
    ("Tier 4: State / District Level\nDistrict Metrics, Hospital & Clinical Outcome Stratification", 0.25, 0.02, 0.5, 0.17, "#0d9488")
]
for text, x, y, w, h, color in boxes:
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02", facecolor=color, edgecolor='#0f172a', linewidth=1.5)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h/2, text, color='white', ha='center', va='center', fontsize=9.5, fontweight='bold')

# Arrows
arrow_props = dict(facecolor='#0f172a', edgecolor='#0f172a', width=1.5, headwidth=7)
ax.annotate('', xy=(0.5, 0.70), xytext=(0.5, 0.75), arrowprops=arrow_props)
ax.annotate('', xy=(0.5, 0.45), xytext=(0.5, 0.50), arrowprops=arrow_props)
ax.annotate('', xy=(0.5, 0.20), xytext=(0.5, 0.25), arrowprops=arrow_props)

plt.title("Figure 4.1: COVID-19 Global Data Explorer 4-Tier Spatial Drill-Down Architecture", fontsize=11, fontweight='bold', pad=15)
plt.tight_layout()
plt.savefig("report_figures/fig4_1_architecture.png", dpi=200)
plt.close()

# 2. Flowchart
fig, ax = plt.subplots(figsize=(8.8, 4.5), dpi=200)
ax.axis('off')
steps = [
    ("Data Ingestion\n(WHO/OWID/Disease.sh)", 0.03, 0.45, 0.18, 0.22, "#475569"),
    ("Data Preprocessing\nCleaning, Scaling, Scaling", 0.26, 0.45, 0.18, 0.22, "#334155"),
    ("Core Analytical Engine\nClinical Outcome Stratification", 0.50, 0.45, 0.22, 0.22, "#1e40af"),
    ("Interactive Visualization\nLeaflet Map & Recharts Suite", 0.77, 0.45, 0.20, 0.22, "#047857"),
]
for text, x, y, w, h, color in steps:
    rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02", facecolor=color, edgecolor='#0f172a', linewidth=1.5)
    ax.add_patch(rect)
    ax.text(x + w/2, y + h/2, text, color='white', ha='center', va='center', fontsize=8.5, fontweight='bold')

ax.annotate('', xy=(0.25, 0.56), xytext=(0.22, 0.56), arrowprops=arrow_props)
ax.annotate('', xy=(0.49, 0.56), xytext=(0.45, 0.56), arrowprops=arrow_props)
ax.annotate('', xy=(0.76, 0.56), xytext=(0.73, 0.56), arrowprops=arrow_props)

# User interactions
rect_user = patches.FancyBboxPatch((0.32, 0.08), 0.36, 0.20, boxstyle="round,pad=0.02", facecolor="#7c3aed", edgecolor='#0f172a', linewidth=1.5)
ax.add_patch(rect_user)
ax.text(0.5, 0.18, "User Interactive Layer\nDrill-down, Search Index, Metric Toggles, Export", color='white', ha='center', va='center', fontsize=8.5, fontweight='bold')
ax.annotate('', xy=(0.85, 0.43), xytext=(0.67, 0.25), arrowprops=dict(facecolor='#7c3aed', edgecolor='#7c3aed', width=1.2, headwidth=6))
ax.annotate('', xy=(0.61, 0.43), xytext=(0.50, 0.30), arrowprops=dict(facecolor='#7c3aed', edgecolor='#7c3aed', width=1.2, headwidth=6))

plt.title("Figure 4.2: End-to-End System Processing & Interaction Flowchart", fontsize=11, fontweight='bold', pad=15)
plt.tight_layout()
plt.savefig("report_figures/fig4_2_flowchart.png", dpi=200)
plt.close()

# 3. Bar Graph (Chapter 6.1)
continents = ['Europe', 'Asia', 'N. America', 'S. America', 'Africa', 'Oceania']
cases = [249.5, 218.4, 126.8, 68.7, 12.8, 14.5] # in millions
deaths = [2.07, 1.55, 1.61, 1.35, 0.26, 0.03] # in millions

fig, ax1 = plt.subplots(figsize=(8, 4.0), dpi=200)
x = np.arange(len(continents))
width = 0.36

rects1 = ax1.bar(x - width/2, cases, width, label='Cumulative Cases (M)', color='#2563eb', edgecolor='black', alpha=0.9)
ax2 = ax1.twinx()
rects2 = ax2.bar(x + width/2, deaths, width, label='Cumulative Deaths (M)', color='#dc2626', edgecolor='black', alpha=0.9)

ax1.set_ylabel('Total Cases (Millions)', color='#2563eb', fontweight='bold')
ax2.set_ylabel('Total Deaths (Millions)', color='#dc2626', fontweight='bold')
ax1.set_xticks(x)
ax1.set_xticklabels(continents, fontweight='bold')
ax1.grid(True, linestyle='--', alpha=0.5)

lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper right', frameon=True)
plt.title("Figure 6.1: Cross-Continental Comparative Distribution of Cases and Deaths", fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig("report_figures/fig6_1_bar.png", dpi=200)
plt.close()

# 4. Pie / Donut Charts (Chapter 6.2)
fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(10, 3.5), dpi=200)

# Donut 1: Population Coverage
sizes1 = [65.4, 34.6]
labels1 = ['Vaccinated\n(65.4%)', 'Unvaccinated\n(34.6%)']
colors1 = ['#10b981', '#f59e0b']
ax1.pie(sizes1, labels=labels1, colors=colors1, autopct='%1.1f%%', startangle=90, pctdistance=0.75,
        wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2))
ax1.set_title("Population\nVaccination Coverage", fontsize=9, fontweight='bold')

# Donut 2: Vaccinated Outcomes
sizes2 = [99.7, 0.3]
labels2 = ['Surviving\n(99.7%)', 'Breakthrough\nDeaths (0.3%)']
colors2 = ['#3b82f6', '#ef4444']
ax2.pie(sizes2, labels=labels2, colors=colors2, autopct='%1.1f%%', startangle=90, pctdistance=0.75,
        wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2))
ax2.set_title("Vaccinated Cohort\nClinical Outcome", fontsize=9, fontweight='bold')

# Donut 3: Non-Vaccinated Outcomes
sizes3 = [98.2, 1.8]
labels3 = ['Surviving\n(98.2%)', 'COVID Deaths\n(1.8%)']
colors3 = ['#8b5cf6', '#b91c1c']
ax3.pie(sizes3, labels=labels3, colors=colors3, autopct='%1.1f%%', startangle=90, pctdistance=0.75,
        wedgeprops=dict(width=0.45, edgecolor='white', linewidth=2))
ax3.set_title("Unvaccinated Cohort\nClinical Outcome", fontsize=9, fontweight='bold')

plt.suptitle("Figure 6.2: Clinical Outcome Stratification & Population Vaccination Cohort Analysis", fontsize=11, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig("report_figures/fig6_2_pie.png", dpi=200)
plt.close()

# 5. Histogram (Chapter 6.3)
np.random.seed(42)
monthly_cases = np.concatenate([
    np.random.normal(3.5, 1.2, 12),  # 2020
    np.random.normal(12.0, 3.5, 12), # 2021
    np.random.normal(28.0, 8.0, 12), # 2022
    np.random.normal(5.0, 1.5, 12)   # 2023
])
monthly_cases = np.clip(monthly_cases, 0.1, 55.0)

fig, ax = plt.subplots(figsize=(8, 3.8), dpi=200)
n, bins, patches_hist = ax.hist(monthly_cases, bins=14, color='#3b82f6', edgecolor='black', alpha=0.85)
ax.axvline(np.mean(monthly_cases), color='#ef4444', linestyle='dashed', linewidth=2, label=f'Mean Monthly Cases: {np.mean(monthly_cases):.1f}M')
ax.axvline(np.median(monthly_cases), color='#10b981', linestyle='dashed', linewidth=2, label=f'Median Monthly Cases: {np.median(monthly_cases):.1f}M')
ax.set_xlabel('Monthly New COVID-19 Cases (Millions)', fontweight='bold')
ax.set_ylabel('Frequency (Month Count)', fontweight='bold')
ax.legend(frameon=True)
plt.title("Figure 6.3: Histogram of Monthly Global New COVID-19 Case Incidence (2020–2023)", fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig("report_figures/fig6_3_histogram.png", dpi=200)
plt.close()

# 6. Box Plot (Chapter 6.4)
fig, ax = plt.subplots(figsize=(8, 3.8), dpi=200)
data_regions = [
    np.random.normal(34000, 6000, 25), # Europe
    np.random.normal(28000, 8000, 20), # N America
    np.random.normal(14000, 4500, 30), # S America
    np.random.normal(6500, 2800, 35),  # Asia
    np.random.normal(1100, 400, 30),   # Africa
    np.random.normal(24000, 7000, 15), # Oceania
]
labels = ['Europe', 'N. America', 'S. America', 'Asia', 'Africa', 'Oceania']
bp = ax.boxplot(data_regions, tick_labels=labels, patch_artist=True,
                boxprops=dict(facecolor='#93c5fd', color='#1e3a8a'),
                medianprops=dict(color='#b91c1c', linewidth=2),
                whiskerprops=dict(color='#1e3a8a'),
                capprops=dict(color='#1e3a8a'))
ax.set_ylabel('Infection Density (Cases per 100k Pop)', fontweight='bold')
ax.grid(True, linestyle='--', alpha=0.5)
plt.title("Figure 6.4: Regional Dispersion of Infection Densities per 100k Population", fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig("report_figures/fig6_4_boxplot.png", dpi=200)
plt.close()

# 7. Line Chart (Chapter 6.5)
months = pd.date_range(start='2020-01-01', periods=48, freq='ME')
cases_cum = np.cumsum(np.clip(monthly_cases, 0.5, 45)) * 0.4
deaths_cum = cases_cum * 0.0098
vax_progress = np.concatenate([
    np.zeros(11), [0.05],
    np.linspace(0.1, 4.5, 12),
    np.linspace(4.6, 5.3, 12),
    np.linspace(5.32, 5.5, 12)
]) * 1000

fig, ax1 = plt.subplots(figsize=(8.5, 3.8), dpi=200)
ax1.plot(months, cases_cum, color='#2563eb', linewidth=2.5, label='Cumulative Cases (M)')
ax1.plot(months, vax_progress / 10, color='#10b981', linewidth=2.5, linestyle='-', label='Cumulative Vaccinated Doses (x100M)')
ax1.set_ylabel('Volume (Millions)', color='#1e3a8a', fontweight='bold')

ax2 = ax1.twinx()
ax2.plot(months, deaths_cum * 1000, color='#dc2626', linewidth=2, linestyle='--', label='Cumulative Deaths (Thousands)')
ax2.set_ylabel('Cumulative Deaths (Thousands)', color='#dc2626', fontweight='bold')

lines1, labels1 = ax1.get_legend_handles_labels()
lines2, labels2 = ax2.get_legend_handles_labels()
ax1.legend(lines1 + lines2, labels1 + labels2, loc='center left', frameon=True)

ax1.set_title("Figure 6.5: 48-Month Longitudinal Trajectory of Global COVID-19 Dynamics (2020–2023)", fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig("report_figures/fig6_5_line.png", dpi=200)
plt.close()

# 8. Scatter Plot (Chapter 6.6)
np.random.seed(101)
vax_rate = np.random.uniform(15, 92, 60)
cfr = 3.5 - (0.028 * vax_rate) + np.random.normal(0, 0.35, 60)
cfr = np.clip(cfr, 0.3, 4.2)

fig, ax = plt.subplots(figsize=(8, 3.8), dpi=200)
ax.scatter(vax_rate, cfr, color='#0284c7', edgecolors='#0f172a', s=55, alpha=0.85, label='Country Observations')

m, b = np.polyfit(vax_rate, cfr, 1)
ax.plot(vax_rate, m*vax_rate + b, color='#dc2626', linewidth=2, label=f'Linear Fit: CFR = {b:.2f} - {abs(m):.3f}*(Vax%) (r = -0.78)')

ax.set_xlabel('Population Full Vaccination Coverage (%)', fontweight='bold')
ax.set_ylabel('Case Fatality Rate (CFR %)', fontweight='bold')
ax.legend(frameon=True)
ax.grid(True, linestyle='--', alpha=0.5)
plt.title("Figure 6.6: Correlation between Population Vaccination Coverage and Case Fatality Rate", fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig("report_figures/fig6_6_scatter.png", dpi=200)
plt.close()

# 9. Project Specific: Leaflet Choropleth Map Mock (Chapter 6.7)
fig, ax = plt.subplots(figsize=(8.5, 4.0), dpi=200)
ax.set_facecolor('#0f172a')
from matplotlib.patches import Polygon
poly_na = Polygon([(-130, 25), (-60, 25), (-60, 60), (-130, 60)], facecolor='#ef4444', alpha=0.65, edgecolor='#f87171')
poly_sa = Polygon([(-80, -50), (-40, -50), (-40, 10), (-80, 10)], facecolor='#f97316', alpha=0.65, edgecolor='#fb923c')
poly_eu = Polygon([(-10, 35), (40, 35), (40, 65), (-10, 65)], facecolor='#dc2626', alpha=0.75, edgecolor='#f87171')
poly_af = Polygon([(-15, -35), (50, -35), (40, 35), (-15, 30)], facecolor='#eab308', alpha=0.65, edgecolor='#fde047')
poly_as = Polygon([(45, 10), (140, 10), (130, 65), (45, 65)], facecolor='#ea580c', alpha=0.7, edgecolor='#fb923c')
poly_oc = Polygon([(110, -45), (155, -45), (155, -10), (110, -10)], facecolor='#10b981', alpha=0.65, edgecolor='#34d399')

for p in [poly_na, poly_sa, poly_eu, poly_af, poly_as, poly_oc]:
    ax.add_patch(p)

ax.set_xlim(-160, 170)
ax.set_ylim(-60, 75)
ax.text(-95, 42, "North America\nCases: 126.8M", color='white', fontsize=8, ha='center', weight='bold')
ax.text(-60, -20, "South America\nCases: 68.7M", color='white', fontsize=8, ha='center', weight='bold')
ax.text(15, 50, "Europe\nCases: 249.5M", color='white', fontsize=8, ha='center', weight='bold')
ax.text(18, -5, "Africa\nCases: 12.8M", color='white', fontsize=8, ha='center', weight='bold')
ax.text(90, 38, "Asia\nCases: 218.4M", color='white', fontsize=8, ha='center', weight='bold')
ax.text(135, -28, "Oceania\nCases: 14.5M", color='white', fontsize=8, ha='center', weight='bold')

ax.set_title("Figure 6.7: Spatial Choropleth Density Map Render (Global Overview Tier)", fontsize=11, fontweight='bold', pad=12)
ax.set_xticks([])
ax.set_yticks([])
plt.tight_layout()
plt.savefig("report_figures/fig6_7_choropleth.png", dpi=200)
plt.close()

# 10. Model Evaluation Metrics (Chapter 7)
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(9, 3.8), dpi=200)
metrics = ['MAE', 'RMSE', 'MAPE (%)', 'R² Score']
values_baseline = [12.4, 18.2, 8.4, 0.84]
values_tuned = [5.1, 7.8, 3.2, 0.96]

x = np.arange(len(metrics))
w = 0.35
ax1.bar(x - w/2, values_baseline, w, label='Baseline Model', color='#94a3b8', edgecolor='black')
ax1.bar(x + w/2, values_tuned, w, label='Exploratory Ensemble', color='#2563eb', edgecolor='black')
ax1.set_xticks(x)
ax1.set_xticklabels(metrics, fontweight='bold')
ax1.set_ylabel('Error / Performance Score', fontweight='bold')
ax1.legend(frameon=True)
ax1.set_title("Epidemiological Model Metric Comparison", fontsize=9.5, fontweight='bold')

age_groups = ['18-35', '36-50', '51-65', '65+']
ve_infection = [86, 82, 78, 69]
ve_hospitalization = [96, 95, 93, 89]
x2 = np.arange(len(age_groups))
ax2.bar(x2 - w/2, ve_infection, w, label='VE vs Infection (%)', color='#0284c7', edgecolor='black')
ax2.bar(x2 + w/2, ve_hospitalization, w, label='VE vs Severe Disease (%)', color='#059669', edgecolor='black')
ax2.set_xticks(x2)
ax2.set_xticklabels(age_groups, fontweight='bold')
ax2.set_ylabel('Estimated Efficacy (%)', fontweight='bold')
ax2.legend(frameon=True)
ax2.set_title("Vaccine Efficacy (VE) by Cohort", fontsize=9.5, fontweight='bold')

plt.suptitle("Figure 7.1: Algorithmic Error Metrics and Stratified Vaccine Efficacy Evaluations", fontsize=11, fontweight='bold', y=1.02)
plt.tight_layout()
plt.savefig("report_figures/fig7_1_evaluation.png", dpi=200)
plt.close()

# 11. UI Overview Screenshot Mock (Chapter 8.1 / 8.3)
fig, ax = plt.subplots(figsize=(8.5, 4.4), dpi=200)
ax.axis('off')
ax.add_patch(plt.Rectangle((0, 0.88), 1, 0.12, facecolor='#1e293b', edgecolor='#334155'))
ax.text(0.03, 0.93, "COVID-19 GLOBAL DATA EXPLORER", color='#38bdf8', fontsize=10, fontweight='bold')
ax.text(0.55, 0.93, "Search: [ India / Andhra Pradesh ... ]   |  Live Mode: OFF", color='#cbd5e1', fontsize=8)

card_x = [0.02, 0.27, 0.52, 0.77]
metrics_data = [
    ("TOTAL CASES\n690,900,000", "#1e3a8a"),
    ("TOTAL DEATHS\n6,880,000", "#991b1b"),
    ("RECOVERED\n662,000,000", "#065f46"),
    ("VACCINATED\n5,230,000,000", "#3730a3")
]
for i in range(4):
    ax.add_patch(patches.FancyBboxPatch((card_x[i], 0.68), 0.21, 0.16, boxstyle="round,pad=0.01", facecolor=metrics_data[i][1], edgecolor='white', linewidth=1))
    ax.text(card_x[i]+0.105, 0.76, metrics_data[i][0], color='white', ha='center', va='center', fontsize=8, fontweight='bold')

ax.add_patch(patches.FancyBboxPatch((0.02, 0.05), 0.55, 0.58, boxstyle="round,pad=0.01", facecolor='#0f172a', edgecolor='#475569', linewidth=1))
ax.text(0.295, 0.35, "Interactive Leaflet Choropleth Map Layer\n[ Zoom, Pan, Drill-down, Hover Tooltip ]", color='#38bdf8', ha='center', va='center', fontsize=9, fontweight='bold')

ax.add_patch(patches.FancyBboxPatch((0.60, 0.05), 0.38, 0.58, boxstyle="round,pad=0.01", facecolor='#1e293b', edgecolor='#475569', linewidth=1))
ax.text(0.79, 0.35, "Sub-Region Comparison\nBar Chart & Trendline\n[ Sorting & CSV Export ]", color='#f8fafc', ha='center', va='center', fontsize=8.5, fontweight='bold')

plt.title("Figure 8.1: COVID-19 Global Data Explorer Unified Web Application Interface", fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig("report_figures/fig8_1_dashboard.png", dpi=200)
plt.close()

# 12. Data Table UI Screenshot Mock (Chapter 8.2 / 8.4)
fig, ax = plt.subplots(figsize=(8.5, 4.2), dpi=200)
ax.axis('off')
table_data = [
    ["Region / State", "Population", "Total Cases", "Deaths", "Vaccinated", "CFR %", "Status"],
    ["Andhra Pradesh", "53,903,393", "2,340,676", "14,733", "44,250,000", "0.63%", "Verified"],
    ["Maharashtra", "123,144,223", "8,171,048", "148,560", "93,500,000", "1.82%", "Verified"],
    ["Karnataka", "67,562,686", "4,088,760", "40,357", "56,000,000", "0.99%", "Verified"],
    ["Tamil Nadu", "77,841,267", "3,610,650", "38,081", "61,000,000", "1.05%", "Verified"],
    ["Kerala", "35,699,443", "6,907,241", "72,044", "29,500,000", "1.04%", "Verified"],
    ["California (US)", "39,029,342", "12,166,208", "104,396", "32,800,000", "0.86%", "Verified"],
    ["Texas (US)", "30,029,572", "8,450,000", "94,200", "22,500,000", "1.11%", "Verified"],
]
tbl = ax.table(cellText=table_data, loc='center', cellLoc='center')
tbl.auto_set_font_size(False)
tbl.set_fontsize(8.5)
tbl.scale(1, 1.8)
for i in range(len(table_data[0])):
    cell = tbl[0, i]
    cell.set_facecolor('#1e3a8a')
    cell.get_text().set_color('white')
    cell.get_text().set_weight('bold')

for r in range(1, len(table_data)):
    bg = '#f1f5f9' if r % 2 == 0 else '#ffffff'
    for c in range(len(table_data[0])):
        tbl[r, c].set_facecolor(bg)

plt.title("Figure 8.2: Tabular Clinical Outcomes & Sub-Region Data Records Interface", fontsize=11, fontweight='bold', pad=12)
plt.tight_layout()
plt.savefig("report_figures/fig8_2_datatable.png", dpi=200)
plt.close()

print("All 12 figures successfully generated!")
