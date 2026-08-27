# MetodePenelitian.com — Master Spec: Quantitative Statistical Analysis Engine V1

**Status:** `PRODUCT NORTH STAR / CAPABILITY CATALOG` — reclassified by owner decision after the Phase 0 audit below. This document defines target product behavior and the full long-run capability catalog. It is **not** an implementation phase plan and does not compete with the platform's own architecture, data models, or execution sequence.

**Authority split (owner decision):**
| Concern | Source of truth |
|---|---|
| Product behavior / capability catalog | this document |
| Architecture | existing locked backend docs (`docs/MASTER BACKEND ARCHITECTURE.md`, `docs/architecture/`) |
| Data models | existing locked [ANALYSIS MODEL.md](../database/ANALYSIS%20MODEL.md), [ANALYSIS RESULT MODEL.md](../database/ANALYSIS%20RESULT%20MODEL.md), [DATASET MODEL.md](../database/DATASET%20MODEL.md) |
| Execution phases | existing [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md), Phase 0–13 |
| Integrity rules | [ADR 011](../adr/ADR%20011%20AI%20IS%20NOT%20SOURCE%20OF%20TRUTH.md), [ADR 012](../adr/ADR%20012%20ANALYSIS%20PROVENANCE%20IS%20IMMUTABLE.md) |

**Owner:** Product (Israanwar), originally drafted for execution by an external coding agent ("Codex").
**Scope of this document:** Fondasi Quantitative Statistical Analysis Engine untuk MetodePenelitian.com sebagai peta kapabilitas jangka panjang. Kualitatif dan mixed methods sengaja di luar cakupan dokumen ini.

> **History:** [Quantitative Analysis Engine Spec — Phase 0 Audit](QUANTITATIVE%20ANALYSIS%20ENGINE%20SPEC%20-%20PHASE%200%20AUDIT.md) found this document's original `PHASE 0`–`PHASE 12` numbering and proposed data model conflicted with the already-`LOCKED` platform sequence and data models. The owner accepted that finding and reclassified this document as above rather than discard it (see the audit's four findings and the [Phase 10 Scoping Amendment](../implementation/PHASE%2010%20SCOPING%20AMENDMENT%20-%20MULTIPLE%20LINEAR%20REGRESSION.md) that followed it). The `Section BM` phase numbering below is preserved as originally written for historical fidelity, but carries **no execution authority** — do not treat `PHASE 0`–`PHASE 12` below as live phases; the platform's own `Phase 0`–`Phase 13` is the only execution sequence in force. This document is preserved otherwise verbatim as the original capability catalog.

---

## Objective

Bangun fondasi Quantitative Research Analysis Engine untuk MetodePenelitian.com sebagai bagian dari Research Operating System.

Sistem tidak boleh dibangun sebagai clone IBM SPSS, SmartPLS, AMOS, LISREL, Stata, EViews, atau software statistik tertentu.

Sistem harus menjadi lapisan intelligence di atas metode statistik yang mampu:

1. menerima data penelitian;
2. memahami struktur penelitian;
3. memahami tipe variabel;
4. memahami skala pengukuran;
5. memeriksa kualitas data;
6. menentukan metode analisis yang sesuai;
7. menjalankan metode statistik;
8. memvalidasi asumsi;
9. menjelaskan hasil;
10. mendeteksi kegagalan;
11. memberikan rekomendasi metodologis;
12. membuat tabel siap laporan;
13. menghasilkan visualisasi;
14. menghasilkan interpretasi akademik;
15. mendukung kompatibilitas workflow software statistik populer;
16. membedakan dengan tegas data empiris dan data sintetis.

Target arsitektur:

```
Research Design
      ↓
Data Workspace
      ↓
Analysis Intelligence
      ↓
Method Selector
      ↓
Statistical Engine
      ↓
Validation Engine
      ↓
Interpretation Engine
      ↓
Research Output
```

---

## Scope

### P0 — Wajib Dibangun

#### A. Research Project Model

Sediakan struktur proyek penelitian yang minimal menyimpan:

```
ResearchProject {
  id
  title
  researchType
  researchDesign
  objective
  population
  sampleSize
  samplingMethod
  variables[]
  hypotheses[]
  instruments[]
  datasets[]
  analyses[]
  outputs[]
}
```

Variable:

```
ResearchVariable {
  id
  code
  name
  role
  measurementLevel
  dataType
  constructType
  indicators[]
}
```

Role:

```
independent
dependent
mediator
moderator
control
covariate
grouping
demographic
latent
observed
```

Measurement level:

```
nominal
ordinal
interval
ratio
binary
count
date
text
```

Construct type:

```
observed
latent_reflective
latent_formative
```

#### B. Data Workspace

Support minimal:

```
CSV
XLSX
XLS
SAV
JSON
manual entry
synthetic dataset
```

Implementasikan parser yang menghasilkan representasi internal konsisten.

Contoh:

```
Dataset {
  id
  name
  sourceType
  rowCount
  columnCount
  columns[]
  missingValueSummary
  metadata
}
```

Column:

```
Column {
  name
  label
  inferredType
  declaredType
  measurementLevel
  validValues
  missingCount
  uniqueCount
}
```

#### C. Data Profiling Engine

Setiap dataset yang masuk harus otomatis dianalisis.

Minimal keluarkan:

```
jumlah observasi
jumlah variabel
tipe variabel
missing values
duplicate rows
unique values
minimum
maximum
mean
median
mode
standard deviation
variance
range
quartiles
IQR
skewness
kurtosis
possible outliers
invalid values
constant columns
near-zero variance
```

Status:

```
PASS
WARNING
FAIL
NOT_APPLICABLE
```

Jangan hanya menampilkan angka.

Berikan juga:

```
finding
severity
reason
recommendedAction
```

#### D. Data Quality Engine

Implementasikan pemeriksaan:

**Missing data**

Support:

```
listwise detection
pairwise detection
MCAR indication
missing percentage
missing pattern
```

Strategi yang dapat direkomendasikan:

```
do nothing
listwise deletion
pairwise deletion
mean/median replacement
multiple imputation
model-based handling
```

Jangan otomatis mengimputasi data empiris tanpa tindakan eksplisit pengguna.

**Duplicate detection**

Deteksi:

```
exact duplicates
duplicate respondent ID
probable duplicate
```

**Outlier detection**

Implementasikan minimal:

```
Z-score
IQR rule
Mahalanobis distance
Cook's Distance
leverage
studentized residual
```

Output harus menyebut observasi yang terkena.

#### E. Variable & Scale Builder

Sistem harus mampu membuat struktur:

```
Variable
→ Indicator
→ Item
```

Contoh:

```
X1 Akuntansi Digital
  ├─ indikator 1
  │    ├─ X1.1
  │    └─ X1.2
  ├─ indikator 2
  ...
```

Support:

```
Likert 1–4
Likert 1–5
Likert 1–6
Likert 1–7
custom ordinal scale
binary
continuous
categorical
```

Support:

```
favorable item
unfavorable item
reverse scoring
```

#### F. Questionnaire Builder

Sediakan engine yang menerima:

```
research variable
variable definition
indicators
number of items per indicator
target population
language
Likert scale
```

Kemudian menghasilkan item.

Harus memiliki validation layer yang mendeteksi:

```
double-barreled statement
ambiguous wording
leading question
absolute wording
duplicate meaning
excessively long statement
negative construction
inconsistent scale
indicator mismatch
construct contamination
```

Questionnaire builder bukan P0 untuk AI generation jika sudah ada modul terpisah, tetapi struktur datanya harus disiapkan sekarang.

#### G. Descriptive Statistics Engine

Implementasikan:

**Numerical**

```
N
mean
median
mode
minimum
maximum
range
variance
standard deviation
standard error
skewness
kurtosis
quartiles
percentiles
coefficient of variation
confidence interval
```

**Categorical**

```
frequency
percentage
valid percentage
cumulative percentage
mode
```

**Cross-tabulation**

```
row percentage
column percentage
total percentage
```

#### H. Visualization Engine

Minimal:

```
histogram
bar chart
pie chart
box plot
scatter plot
Q-Q plot
P-P plot
line chart
correlation heatmap
residual plot
frequency chart
```

Visualisasi harus dihasilkan dari struktur chart data, bukan gambar statis hard-coded.

#### I. Validity Engine

Implementasikan minimal:

**Pearson Product Moment**

Output:

```
r calculated
p-value
N
critical r optional
decision
```

Decision rules configurable:

```
p < alpha
r_calculated > r_table
```

**Corrected Item-Total Correlation**

Per item:

```
item
corrected item-total correlation
decision
```

Default warning threshold:

```
>= 0.30 acceptable
```

Namun jangan hard-code sebagai kebenaran universal.

Rule harus berasal dari:

```
DecisionRule {
  metric
  operator
  threshold
  source
  configurable
}
```

#### J. Reliability Engine

Implementasikan:

```
Cronbach's Alpha
Cronbach's Alpha Based on Standardized Items
item-total statistics
alpha if item deleted
inter-item correlation
```

Output:

```
construct
number of items
alpha
decision
```

Support threshold configurable.

Default educational reference:

```
>= .90 excellent
>= .80 good
>= .70 acceptable
>= .60 context-dependent
```

Jangan menghasilkan klaim universal tanpa konteks.

#### K. Normality Engine

Implementasikan:

```
Kolmogorov-Smirnov
Lilliefors correction
Shapiro-Wilk
Q-Q plot
P-P plot
skewness
kurtosis
```

**PENTING:**

Untuk regression assumption, normalitas diperiksa terhadap:

```
regression residual
```

bukan secara otomatis terhadap setiap variabel independen.

UI harus menjelaskan perbedaannya.

Output:

```
test
statistic
df / N
p-value
decision
```

#### L. Multicollinearity Engine

Implementasikan:

```
Tolerance
VIF
correlation matrix
condition index future-compatible
```

Minimal decision defaults:

```
Tolerance > .10
VIF < 10
```

Tambahkan warning:

```
VIF > 5
```

tetapi jangan otomatis FAIL jika metode pengguna menggunakan threshold 10.

#### M. Heteroscedasticity Engine

Implementasikan minimal:

```
Glejser test
Breusch-Pagan
residual vs predicted scatterplot
```

Future support:

```
White test
Goldfeld-Quandt
```

Output:

```
method
predictor
coefficient optional
p-value
decision
```

#### N. Autocorrelation Engine

Implementasikan:

```
Durbin-Watson
```

Future:

```
Breusch-Godfrey
```

Jangan menggunakan Durbin-Watson untuk setiap desain penelitian secara membabi buta.

Method Selector menentukan applicability.

#### O. Correlation Engine

Implementasikan:

```
Pearson
Spearman
Kendall Tau
partial correlation
```

Output:

```
coefficient
p-value
N
confidence interval if available
effect interpretation
```

#### P. Simple Linear Regression

Model:

```
Y = a + bX + e
```

Output minimal:

**Model Summary**

```
R
R Square
Adjusted R Square
Std. Error of Estimate
```

**ANOVA**

```
Regression SS
Residual SS
Total SS
df
MS
F
Sig.
```

**Coefficients**

```
Constant B
Std Error
X B
Standardized Beta
t
Sig.
95% CI
```

**Diagnostics**

```
residual normality
heteroscedasticity
outliers
influential observations
```

#### Q. Multiple Linear Regression

Model generic:

```
Y = a + b1X1 + b2X2 + ... + bnXn + e
```

Output wajib:

**Model Summary**

```
R
R Square
Adjusted R Square
Std. Error of Estimate
```

**ANOVA / F Test**

```
SS Regression
SS Residual
SS Total
df
MS
F
Sig.
```

**Coefficients / t Test**

```
B
Std Error
Beta
t
Sig.
Tolerance
VIF
CI lower
CI upper
```

**Diagnostics**

```
residual normality
multicollinearity
heteroscedasticity
autocorrelation if applicable
outlier diagnostics
```

Interpretasi otomatis:

```
direction
significance
magnitude
hypothesis status
```

Contoh internal:

```json
{
  "hypothesis": "H1",
  "relationship": "X1 -> Y",
  "direction": "positive",
  "coefficient": 0.345,
  "t": 8.49,
  "p": 0.000001,
  "decision": "SUPPORTED"
}
```

Jangan mengubah data empiris untuk membuat hipotesis supported.

#### R. Group Comparison Engine

Implementasikan:

```
One Sample t Test
Independent Samples t Test
Paired Samples t Test
One-Way ANOVA
Repeated Measures ANOVA
```

Support assumptions:

```
normality
homogeneity
independence
```

Levene's test wajib.

#### S. Nonparametric Engine

Implementasikan:

```
Mann-Whitney U
Wilcoxon Signed Rank
Kruskal-Wallis
Friedman
Spearman
Chi-Square
Fisher Exact
```

Method Selector harus mampu merekomendasikan alternatif nonparametrik ketika diperlukan.

#### T. Chi-Square Engine

Support:

```
Chi-Square Goodness of Fit
Chi-Square Independence
Fisher Exact
Cramer's V
Phi coefficient
```

Output:

```
observed
expected
chi-square
df
p
effect size
```

#### U. Method Selector

Ini adalah bagian utama produk.

Input:

```
research objective
number of dependent variables
number of independent variables
variable roles
measurement levels
sample size
number of groups
repeated measurement
latent variables
mediator
moderator
panel structure
time-series structure
distribution characteristics
```

Output:

```
MethodRecommendation {
  recommendedMethod
  confidence
  reasons[]
  requiredAssumptions[]
  alternativeMethods[]
  notRecommended[]
}
```

Contoh:

```
Objective:
Determine effect of X1, X2, X3 on Y
X:
continuous composite scores
Y:
continuous composite score
Recommendation:
Multiple Linear Regression
Reason:
one continuous dependent variable
multiple predictors
objective is explanatory/predictive
```

Contoh lain:

```
Latent constructs: yes
Indicators: multiple
Mediation: yes
Prediction-oriented study: yes
Recommended:
PLS-SEM
Alternative:
CB-SEM
Do not use:
ordinary multiple regression to simultaneously validate latent measurement structure
```

#### V. Analysis Pipeline Builder

Setelah Method Selector memilih metode, buat analysis pipeline otomatis.

Contoh multiple regression:

```
01 Data Integrity
02 Descriptive Statistics
03 Instrument Validity
04 Reliability
05 Composite Score
06 Residual Normality
07 Multicollinearity
08 Heteroscedasticity
09 Regression Model
10 t Test
11 F Test
12 R²
13 Hypothesis Decision
14 Interpretation
```

Setiap node mempunyai status:

```
NOT_STARTED
RUNNING
PASS
WARNING
FAIL
SKIPPED
```

#### W. Validation Engine

Jangan hard-code sekadar:

```
p > .05 = PASS
```

Bangun generic rule engine.

```
ValidationRule {
  id
  analysisType
  metric
  operator
  threshold
  severity
  description
  configurable
}
```

Contoh:

```json
{
  "analysisType": "multicollinearity",
  "metric": "VIF",
  "operator": "<",
  "threshold": 10,
  "severity": "FAIL"
}
```

Simpan rule profile.

Contoh:

```
Default
Conservative
University Template
Custom
```

#### X. Diagnostic Engine

Jika analysis FAIL, sistem tidak hanya mengatakan gagal.

Contoh:

```
Normality
FAIL
K-S p = .012
Possible causes:
- extreme outlier
- skewed residual distribution
- model misspecification
Inspect:
Respondents 12, 43, 67
Recommended:
1. verify data entry
2. inspect extreme observations
3. evaluate transformation only when theoretically appropriate
4. consider robust/nonparametric alternative
```

Untuk multicollinearity:

```
X2 VIF = 12.6
Likely cause:
X2 strongly overlaps with X3.
Do not automatically delete X2.
Check:
- theoretical redundancy
- correlation
- item overlap
- construct definition
```

#### Y. Interpretation Engine

Semua hasil statistik harus punya structured interpretation.

Jangan generate narasi langsung dari raw prompt saja.

Gunakan:

```
StatisticalFinding {
  metric
  value
  threshold
  decision
  statisticalMeaning
  researchMeaning
}
```

Kemudian baru AI membentuk bahasa akademik.

Support output:

```
simple explanation
academic explanation
BAB IV explanation
journal results style
presentation style
```

#### Z. Hypothesis Engine

Hypothesis:

```
Hypothesis {
  id
  statement
  sourceVariable
  targetVariable
  expectedDirection
  analysis
}
```

Decision:

```
SUPPORTED
NOT_SUPPORTED
PARTIALLY_SUPPORTED
NOT_TESTABLE
```

Decision tidak boleh ditentukan dari arah saja.

Gunakan:

```
coefficient
significance
confidence interval
expected direction
```

#### AA. Table Generator

Output tabel compatible style:

```
SPSS-like
APA 7
Thesis
Journal
Minimal
```

Jangan copy desain proprietary SPSS secara identik.

Gunakan clean research tables.

Support:

```
HTML
Markdown
XLSX
DOCX-ready structured data
```

#### AB. Result Export

Minimal:

```
CSV
XLSX
JSON
PDF future
DOCX future
```

Export analysis project:

```
dataset
variable definitions
analysis parameters
results
decision rules
interpretations
charts
audit trail
```

#### AC. Analysis History

Setiap run harus disimpan.

```
AnalysisRun {
  id
  datasetVersion
  analysisType
  parameters
  results
  validation
  createdAt
}
```

Dataset tidak boleh silently overwritten.

#### AD. Audit Trail

Simpan:

```
upload
cleaning
transformations
reverse scoring
missing handling
outlier actions
analysis execution
parameter changes
exports
```

Tujuan:

```
reproducibility
academic integrity
debugging
```

#### AE. Empirical Data Mode

Mode:

```
REAL / EMPIRICAL DATA
```

Aturan keras:

**DO:**

```
analyze
clean transparently
detect anomalies
diagnose
recommend
transform with user intent
re-run analysis
```

**DO NOT:**

```
fabricate observations
change responses to obtain significance
change values to force R²
change data to support hypotheses
silently remove problematic cases
```

Jika user meminta:

> "buat p-value signifikan"

pada empirical mode, return:

```
Cannot modify empirical responses to manufacture statistical significance.
Available:
- diagnose why result is not significant
- inspect data quality
- evaluate model specification
- run justified alternative analysis
```

#### AF. Simulation Lab

Mode terpisah:

```
SYNTHETIC / SIMULATION DATA
```

Tujuan:

```
education
statistical simulation
method demonstration
power exploration
sensitivity analysis
software training
```

Input:

```
N
variables
items
scale
distribution
correlation
effect size
reliability target
R² target
significance constraints
missing rate
outlier rate
```

Contoh:

```json
{
  "sampleSize": 87,
  "constructs": {
    "X1": 4,
    "X2": 3,
    "X3": 4,
    "Y": 5
  },
  "likertScale": 5,
  "constraints": {
    "validity": true,
    "reliability": 0.7,
    "normality": true,
    "maxVIF": 5,
    "heteroscedasticity": false,
    "positiveEffects": true,
    "significantEffects": true,
    "minR2": 0.70
  }
}
```

Simulation engine dapat iterasi sampai constraint terpenuhi.

Wajib watermark metadata:

```
SYNTHETIC DATA
FOR EDUCATIONAL / SIMULATION USE
NOT EMPIRICAL RESPONDENT DATA
```

Tidak boleh ada fungsi untuk menghapus watermark secara diam-diam.

#### AG. Synthetic Data Generator

Jangan generate setiap cell secara random independen.

Gunakan latent data generating process.

Contoh:

```
latent construct
↓
item loading
↓
measurement noise
↓
ordinal threshold
↓
Likert response
```

Untuk regression:

```
X latent variables
↓
structural coefficients
↓
Y latent variable
↓
Y indicators
```

Support:

```
seed
reproducibility
target correlation
target reliability
target effect
target R²
distribution preference
response tendency
```

#### AH. Constraint Solver

Support constraint:

```
Cronbach alpha >= x
minimum item correlation >= x
R² range
positive coefficient
negative coefficient
significant relationship
nonsignificant relationship
VIF maximum
normality threshold
heteroscedasticity status
response distribution
```

Constraint solver:

```
Generate
→ Analyze
→ Compare constraints
→ Adjust parameters
→ Regenerate
→ Validate
```

Tetapkan max iteration.

Return:

```
PASS
PARTIAL
UNSATISFIABLE
```

Jangan infinite loop.

#### AI. Reproducibility

Setiap synthetic generation harus menyimpan:

```
seed
generator version
parameters
constraints
iteration count
final statistics
```

Dataset yang sama harus bisa direproduksi.

#### AJ. Statistical Backend

Jangan implementasikan seluruh matematika statistik manual tanpa alasan.

Recommended Python stack:

```
NumPy
SciPy
pandas
statsmodels
scikit-learn where appropriate
pingouin optional
factor_analyzer optional
semopy future
```

R dapat menjadi future execution backend.

Bangun abstraction:

```
StatisticalProvider {
  run()
  validateInput()
  normalizeOutput()
}
```

Sehingga nanti bisa punya:

```
PythonProvider
RProvider
RemoteProvider
```

#### AK. Internal Result Schema

Semua analysis harus menghasilkan struktur konsisten.

```
AnalysisResult {
  id
  analysisType
  datasetId
  status
  inputs
  statistics
  tables
  charts
  assumptions
  findings
  recommendations
  interpretationData
  metadata
}
```

Jangan membuat format khusus yang berbeda total untuk setiap metode.

#### AL. Error Handling

Handle:

```
empty dataset
non-numeric input
invalid scale
too few observations
zero variance
singular matrix
perfect multicollinearity
missing columns
insufficient categories
invalid grouping
unsupported analysis
statistical convergence failure
```

User-facing message:

```
what failed
why
how to fix
```

Developer log boleh lebih teknis.

#### AM. Method Compatibility Layer

Jangan mengintegrasikan semua software sekarang.

Simpan metadata:

```
MethodCompatibility {
  method
  supportedTools
}
```

Contoh:

```
Multiple Linear Regression
Compatible workflows:
IBM SPSS Statistics
Stata
R
Python
SAS
JMP
Minitab
jamovi
JASP
```

```
PLS-SEM:
SmartPLS
ADANCO
WarpPLS
R seminr
R cSEM
```

```
CB-SEM:
AMOS
LISREL
Mplus
lavaan
EQS
OpenMx
```

Ini hanya compatibility knowledge.

Jangan clone UI software tersebut.

#### AN. Future Module Boundaries

Arsitektur sekarang harus memungkinkan modul berikut ditambahkan tanpa rewrite besar:

```
PLS-SEM
CB-SEM
CFA
EFA
mediation
moderation
PROCESS-style analysis
panel data
time series
econometrics
survival analysis
multilevel modeling
Rasch
IRT
meta-analysis
Bayesian analysis
machine learning
spatial statistics
```

Tetapi jangan implement sekarang jika belum masuk acceptance scope.

### P1 — Setelah Core Stabil

#### AO. PLS-SEM Engine

Future implementation:

```
outer loading
Cronbach alpha
rho_A
Composite Reliability
AVE
cross-loading
Fornell-Larcker
HTMT
VIF
path coefficient
bootstrapping
direct effect
indirect effect
total effect
R²
Adjusted R²
f²
Q²
PLSpredict
IPMA
mediation
moderation
MGA
MICOM
```

Compatibility:

```
SmartPLS
ADANCO
WarpPLS
seminr
cSEM
```

#### AP. CB-SEM Engine

Future:

```
CFA
factor loading
measurement model
structural model
covariance matrix
chi-square
CMIN/DF
CFI
TLI
GFI
AGFI
RMSEA
SRMR
AIC
BIC
modification indices
direct effect
indirect effect
total effect
```

Compatibility:

```
AMOS
LISREL
Mplus
lavaan
EQS
OpenMx
```

#### AQ. Mediation & Moderation

Support future:

```
simple mediation
parallel mediation
serial mediation
simple moderation
moderated mediation
conditional effects
simple slopes
Johnson-Neyman
bootstrap confidence interval
```

Compatibility reference:

```
PROCESS Macro
Mplus
SmartPLS
lavaan
R mediation
```

#### AR. Power & Sample Size

Future:

```
correlation
t-test
ANOVA
multiple regression
logistic regression
proportions
SEM approximation
power
effect size
alpha
sample size
```

Compatibility:

```
G*Power
PASS
nQuery
R pwr
Stata power
```

### P2

Only after P0 + P1 stable:

```
econometrics
panel
time-series
Rasch
IRT
psychometrics advanced
multilevel
longitudinal
survival
meta-analysis
spatial
experimental design
```

### P3

Do not prioritize now:

```
Bayesian advanced
deep learning
specialized scientific models
niche industrial analytics
```

---

## UX Principles

#### AU. UX Principles

Jangan membuat dashboard statistik yang hanya berisi tabel.

UX harus menjawab tiga pertanyaan:

1. Apa hasilnya?
2. Apakah memenuhi syarat?
3. Apa artinya?

Contoh card:

```
Normality
PASS
Kolmogorov-Smirnov
p = 0.144
Residual distribution does not provide evidence
against normality at α = .05.
```

#### AV. Analysis Workspace

Layout recommended:

```
┌────────────────────────────────────────────────────┐
│ Research Project                                   │
├──────────────┬────────────────────────┬─────────────┤
│ Pipeline     │ Analysis               │ Copilot     │
│              │                        │             │
│ ✓ Data       │ Regression             │ Explain     │
│ ✓ Validity   │                        │ Diagnose    │
│ ✓ Reliability│ Model Summary          │ Interpret   │
│ ✓ Normality  │ ANOVA                  │             │
│ ✓ VIF        │ Coefficients           │             │
│ ✓ Glejser    │ Diagnostics            │             │
│ ✓ Regression │                        │             │
└──────────────┴────────────────────────┴─────────────┘
```

Jangan menjadikan UI seperti spreadsheet software tahun 2000-an.

#### AW. Statistical Copilot

Copilot harus menerima structured analysis context.

Jangan biarkan model menebak angka.

Context:

```json
{
  "analysis": "multiple_regression",
  "dependent": "Y",
  "predictors": ["X1", "X2", "X3"],
  "rSquare": 0.72,
  "f": 71.06,
  "fP": 0.000001,
  "coefficients": [...]
}
```

Baru AI menjawab.

Copilot actions:

```
Explain this result
Interpret academically
Why did this test fail?
What should I do next?
Compare X1, X2, X3
Generate BAB IV narrative
Explain for beginner
```

---

## Security

#### AX. Security

Validate uploads.

Prevent:

```
formula injection
CSV injection
malicious file payload
path traversal
oversized dataset abuse
arbitrary code execution
unsafe deserialization
```

Set:

```
file limits
row limits
column limits
execution timeout
memory limits
```

Statistical engine harus isolated.

---

## Performance

#### AY. Performance

Target initial:

```
100–10,000 rows common workflow
up to hundreds of variables
```

Analysis harus asynchronous internally only if infrastructure supports jobs, tetapi frontend harus mempunyai job state.

Support:

```
queued
running
completed
failed
```

---

## Testing

#### AZ. Testing

Unit tests wajib untuk:

```
descriptive statistics
Pearson
Cronbach alpha
K-S
Shapiro-Wilk
VIF
Glejser
Durbin-Watson
t-test
ANOVA
Chi-square
correlation
simple regression
multiple regression
R²
Adjusted R²
F
t
```

Bandingkan output terhadap reference results.

#### BA. Golden Datasets

Buat fixed test fixtures.

Minimal:

```
clean regression dataset
multicollinear dataset
heteroscedastic dataset
nonnormal dataset
invalid-item dataset
unreliable-scale dataset
missing-data dataset
outlier dataset
categorical dataset
t-test dataset
ANOVA dataset
Chi-square dataset
```

Setiap dataset mempunyai expected outputs.

#### BB. Cross-Validation Against Known Software

Untuk core tests, bandingkan hasil numeric dengan minimal salah satu reference:

```
R
statsmodels
SciPy
IBM SPSS manually verified output fixture
```

Tolerance numeric harus didefinisikan.

Contoh:

```
absolute tolerance = 1e-6
```

untuk perhitungan yang relevan.

#### BC. Acceptance Test — Multiple Regression

Given:

```
N = 87
X1
X2
X3
Y
```

System harus menghasilkan: descriptive statistics, residual normality, Tolerance, VIF, Glejser, Model Summary, ANOVA, Coefficients, t-tests, F-test, R², Adjusted R², hypothesis decisions, interpretation.

Dan nilai numeric harus sesuai reference implementation.

#### BD. Acceptance Test — Questionnaire Data

Given:

```
X1 = 4 items
X2 = 3 items
X3 = 4 items
Y = 5 items
N = 87
Likert = 1–5
```

System harus: identify constructs, calculate item statistics, run validity, run reliability, calculate construct scores, prepare regression, run assumptions, run regression, generate hypothesis decision.

#### BE. Acceptance Test — Simulation Lab

Given:

```
N = 87
Likert 1–5
X1 = 4 items
X2 = 3
X3 = 4
Y = 5
constraints:
alpha >= .70
normal residual
VIF < 5
no heteroscedasticity
X1 positive significant
X2 positive significant
X3 positive significant
R² >= .70
```

System: generate, analyze, validate, iterate if needed.

Output:

```
PASS
seed
iterations
final dataset
statistics
synthetic watermark
```

---

## Do / Do Not

#### BF. Do

1. Audit existing MetodePenelitian.com repository before coding.
2. Reuse stable architecture where possible.
3. Identify current frontend/backend stack.
4. Create modular statistical domain.
5. Separate statistical computation from UI.
6. Separate empirical and simulation workflows.
7. Build typed result schemas.
8. Build validation-rule engine.
9. Build analysis pipeline.
10. Build reproducible tests.
11. Use established statistical libraries.
12. Return deterministic structured results.
13. Add meaningful error handling.
14. Preserve audit trail.
15. Build extensibility for SEM/PLS later.
16. Keep UI implementation minimal until core computation is proven.
17. Document formulas and library sources internally.
18. Verify every implemented method against reference output.

#### BG. Do Not

1. Do not build 200 separate tools.
2. Do not clone IBM SPSS UI.
3. Do not clone SmartPLS UI.
4. Do not hard-code statistical outputs.
5. Do not fake PASS status.
6. Do not generate interpretation from guessed numbers.
7. Do not manipulate empirical data to satisfy hypothesis.
8. Do not merge empirical and simulation modes.
9. Do not silently delete observations.
10. Do not silently impute values.
11. Do not silently transform variables.
12. Do not add qualitative analysis now.
13. Do not add mixed-method analysis now.
14. Do not implement SEM before P0 is stable.
15. Do not build unnecessary integrations.
16. Do not refactor unrelated stable areas.
17. Do not break existing routes/features.
18. Do not overengineer infrastructure prematurely.
19. Do not make claims of SPSS/SmartPLS equivalence without numerical verification.
20. Do not call the platform "SPSS online."

---

## Module Structure, API, and Knowledge Layers

#### BH. Recommended Module Structure

Adapt to repository stack, but conceptually:

```
research/
  domain/
    project
    variable
    hypothesis
    instrument
data/
  import/
  profiler/
  cleaning/
  transformation/
statistics/
  descriptive/
  validity/
  reliability/
  normality/
  correlation/
  regression/
  comparison/
  nonparametric/
  categorical/
  diagnostics/
analysis/
  selector/
  pipeline/
  validation/
  interpretation/
  hypothesis/
simulation/
  generator/
  constraints/
  validator/
compatibility/
  methods/
  tools/
output/
  tables/
  charts/
  export/
audit/
```

#### BI. API Design

Example:

```
POST /api/research/projects
POST /api/data/import
POST /api/data/profile
POST /api/analysis/recommend
POST /api/analysis/descriptive
POST /api/analysis/validity
POST /api/analysis/reliability
POST /api/analysis/normality
POST /api/analysis/correlation
POST /api/analysis/regression
POST /api/analysis/t-test
POST /api/analysis/anova
POST /api/analysis/nonparametric
POST /api/analysis/chi-square
POST /api/analysis/pipeline/run
POST /api/simulation/generate
POST /api/simulation/validate
GET /api/analysis/:id
GET /api/analysis/:id/export
```

Adapt to existing routing architecture.

Do not blindly create REST if repository is using another established pattern.

#### BJ. Analysis Recommendation Model

Example rule matrix:

```
2 continuous variables
→ Pearson / Spearman
1 categorical binary IV + continuous DV
→ independent t-test
1 categorical >2 groups + continuous DV
→ ANOVA
multiple continuous predictors + continuous DV
→ multiple regression
categorical DV binary
→ logistic regression
two categorical variables
→ Chi-square
repeated continuous two measurement
→ paired t-test
ordinal/non-normal two independent groups
→ Mann-Whitney
ordinal/non-normal >2 groups
→ Kruskal-Wallis
latent constructs
→ SEM family
```

This should evolve into rules + AI reasoning, not AI-only.

#### BK. Method Knowledge Graph

Prepare schema:

```
ResearchMethod {
  id
  name
  category
  objectives[]
  allowedVariableTypes[]
  minimumRequirements[]
  assumptions[]
  outputs[]
  alternatives[]
  compatibleTools[]
}
```

Example:

```
Multiple Linear Regression
Category:
Regression
Objective:
effect
prediction
Requirements:
one continuous DV
two or more predictors
Assumptions:
linearity
independence
homoscedasticity
residual normality
low multicollinearity
Compatible:
SPSS
Stata
R
Python
SAS
JMP
jamovi
JASP
```

This becomes the backbone of Method Selector.

#### BL. Tool Knowledge Layer

Create metadata architecture now, but do not fill hundreds manually inside application code.

Example:

```
ResearchTool {
  name
  vendor
  categories[]
  supportedMethods[]
  importFormats[]
  exportFormats[]
  website
}
```

Future tool registry can contain: IBM SPSS Statistics, AMOS, SmartPLS, LISREL, Mplus, Stata, EViews, R, Python, SAS, JASP, jamovi, G*Power, PROCESS, Winsteps, etc.

---

## Phased Implementation

> **Note (local numbering, unreconciled):** the phases below (`PHASE 0` … `PHASE 12`) are this spec's own sequence for the quantitative engine only. They are **not** the same sequence as the platform's already-`LOCKED` [P0 Backend Implementation Sequence](../implementation/P0%20BACKEND%20IMPLEMENTATION%20SEQUENCE.md) (`Phase 0 — Foundation` … `Phase 13 — First End-to-End Vertical Slice`), which places all of Section G–T above inside a single, narrowly-scoped `Phase 10 — Data & Analysis Contract`. See the audit for the reconciliation this spec still needs.

#### BM. Phased Implementation

**PHASE 0 — AUDIT**

Before modification: repository structure, stack, database, auth, current project model, existing research workflow, existing analysis tools, existing AI layer, existing upload flow, existing UI components, test infrastructure.

Output audit first.

**PHASE 1 — FOUNDATIONS**

Implement: research schemas, dataset schemas, analysis schemas, validation schemas, statistical provider abstraction, audit trail foundation.

Do not build full UI.

**PHASE 2 — DATA ENGINE**

Implement: CSV/XLSX import, type inference, profiling, missing detection, duplicates, descriptive statistics.

Test. LOCK.

**PHASE 3 — INSTRUMENT ENGINE**

Implement: construct/item mapping, reverse scoring, validity, Cronbach alpha, construct scoring.

Test against fixtures. LOCK.

**PHASE 4 — ASSUMPTION ENGINE**

Implement: K-S, Shapiro-Wilk, VIF/Tolerance, Glejser, Breusch-Pagan, Durbin-Watson, outlier diagnostics.

Test. LOCK.

**PHASE 5 — REGRESSION ENGINE**

Implement: simple regression, multiple regression, Model Summary, ANOVA, Coefficients, Beta, t, F, R², Adjusted R², CI, diagnostics.

Test against reference output. LOCK.

**PHASE 6 — BASIC INFERENTIAL ENGINE**

Implement: correlations, t-tests, ANOVA, Chi-square, nonparametrics.

LOCK.

**PHASE 7 — METHOD SELECTOR**

Implement deterministic rule engine first. Then optional AI explanation.

LOCK.

**PHASE 8 — PIPELINE ENGINE**

Implement: recommended analysis flow, dependency checking, PASS/WARNING/FAIL, progress state.

LOCK.

**PHASE 9 — INTERPRETATION ENGINE**

Structured result → interpretation. Do not give LLM raw dataset unless necessary.

LOCK.

**PHASE 10 — SIMULATION LAB**

Only after empirical analysis core is stable.

Implement: synthetic generator, latent-variable generator, constraints, iteration, reproducibility, watermark.

LOCK.

**PHASE 11 — ANALYSIS WORKSPACE UI**

Only now build polished UX. Focus: pipeline, analysis, diagnostics, copilot, output.

**PHASE 12 — EXPORT**

Implement: CSV, XLSX, analysis report data, publication tables.

---

## Test, Report, and Stop Discipline

#### BN. Test

Before declaring any phase PASS, run: unit test, integration test, fixture comparison, regression test, error-path test, security validation.

For every mathematical method: expected numerical result, actual result, tolerance, PASS/FAIL.

No visual-only QA is sufficient for statistical functions.

#### BO. Report

After each phase return exactly:

```
PHASE:
STATUS:
IMPLEMENTED:
- ...
FILES CHANGED:
- ...
TESTS:
- ...
NUMERICAL VERIFICATION:
- ...
KNOWN LIMITATIONS:
- ...
REGRESSION RISK:
- ...
NEXT RECOMMENDED PHASE:
- ...
```

Do not say production-ready unless verified.

#### BP. Stop

For the first run, DO ONLY: **PHASE 0 — AUDIT**.

Do not implement code yet.

Return:

1. current architecture;
2. reusable components;
3. conflicts with this specification;
4. proposed module placement;
5. dependencies required;
6. database implications;
7. API implications;
8. security implications;
9. test strategy;
10. implementation sequence;
11. files likely to be touched;
12. risks.

Then STOP.

Wait for explicit approval before PHASE 1.

Do not open qualitative analysis. Do not open mixed-method analysis. Do not add SEM/PLS yet. Do not redesign unrelated UI.
