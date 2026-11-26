# Linear Assembly Lab — revised concentrated constructions

Version 3, November 26, 2026. Based on the supplied *Linear Assemblies: Expected and High Probability*, `Linear_Assemblies__Expected_and_High_Probability (3).pdf`, Sections 3.1, 4.2 and 6.1 (Lemmas 5–8).

## What changed

The concentrated one-pad generator now concatenates the paper's positive-ternary blocks. The concentrated two-pad generator now concatenates its positive-base-b blocks with a common reset pool and delay path. The shared two-pad generator also updates expected-length mode to the same Section 4.2 construction.

The seed contributes one to length and cost. Block means sum to N−1. Blocks have private glue namespaces, and their final tiles expose the next input without extra connector attachments. Expected total length remains exactly N.

One-pad blocks may use multiplicity two. **Charged entries** count multiplicities; **distinct tile types** count distinct west/east rules. These quantities are computed and displayed separately, including in compact recipes. Two-pad blocks remain equimolar.

## Positive digits

For base b≥2, represent a positive block mean as

    M = Σ(i=1..k) a_i b^(k−i),       a_i ∈ {1,…,b}.

Repeatedly take a=1+((M−1) mod b), replace M by (M−a)/b, and reverse the extracted digits. One-pad blocks use b=3. Two-pad base `auto` compares integers from 2 through max(16, ceil(2 sqrt(ln(M+1)))), choosing the smallest literal count; ties prefer smaller variance, then the smaller base. This includes the paper's sqrt(log)-scale base. A supplied base between 2 and 256 is used directly. The search is not a minimum-tile-set algorithm.

## One-pad block — Lemma 5

Use the positive-ternary system of Section 3.1 at total target M+1, omitting its seed. Create a deterministic path of a_1 attachments from A to g_1; let B be the interface after its first tile. Thus B=g_1 if a_1=1. All endpoint labels g_i are distinct, and other path labels are fresh.

For each later digit add:

| Digit | Advance | Reset to A | Reset to B |
| --- | --- | --- | --- |
| 1 | (g_(i−1),g_i), multiplicity 1 | none | (g_(i−1),B), multiplicity 2 |
| 2 | (g_(i−1),g_i), multiplicity 1 | multiplicity 1 | multiplicity 1 |
| 3 | (g_(i−1),g_i), multiplicity 1 | (g_(i−1),A), multiplicity 2 | none |

The block input is A and its output is g_k. It uses

    charged entries = a_1 + 3(k−1),
    distinct types = a_1 + Σ(i=2..k) [3 if a_i=2, otherwise 2].

The charged count is at most 3 log_3(M+1). No seed is included in these block counts. Each reachable unfinished interface is necessarily visited before the output, so its expected remaining attachments are at most M (Lemma 5).

## Two-pad block — Section 4.2 and Lemma 6

Use positive base-b digits. Write A=(A,⊥), g_i=(c,u_i) for i<k, and g_k=(⊥,u_k). Create a deterministic path of a_1 tiles from A to g_1, with fresh first-pad interior labels and inert second pads. Let B be its first output interface, with B=g_1 when a_1=1.

For j≥1 write d_j=(d_j,⊥), and set d_0=A. For each later digit choose

    v_i = B               if a_i=1,
          A               if a_i=2,
          d_(a_i−2)       if a_i≥3.

When k>1 add these equimolar rules:

| Tile | West interface | East interface | Range |
| --- | --- | --- | --- |
| Advance T_i | (⊥,u_(i−1)) | g_i | 2≤i≤k |
| Digit reset Q_i | (⊥,u_(i−1)) | v_i | 2≤i≤k |
| Common reset C_j | (c,ξ_j) | B | 1≤j≤b−2 |
| Delay D_j | d_j | d_(j−1) | 1≤j≤b−2 |

Every ξ_j appears only on west pads. At each unfinished digit interface there are exactly b matching tiles: the advance, its private reset, and b−2 common resets. Matching is OR over corresponding pad positions; a double match counts once. The final interface g_k has no c pad and no west pad labelled u_k, so it terminates the block.

The nonseed cost is a_1+2(k−1)+2(b−2). If k=1, use only the deterministic initial path of M=a_1 tiles. When b=2, both shared pools are empty. The residual mean is at most M at mandatory path/digit interfaces and M+j at reachable d_j, which is less than 2M (Lemma 6).

## Exact moment recurrences

Let h_i and v_i be the mean and variance for the prefix ending at digit i, measured from the block input. Initialize h_1=a_1 and v_1=0. Both families satisfy

    h_i = b h_(i−1) + a_i.

For the one-pad construction, b=3 and

    v_i = 3v_(i−1) + 6h_(i−1)^2 + 6(a_i−1)h_(i−1) + a_i(a_i−1).

For the revised two-pad construction,

    v_i = b v_(i−1) + b(b−1)h_(i−1)^2
          + 2b(a_i−1)h_(i−1) + 2(a_i−1)^2.

For a derivation, first reach the preceding digit interface. Its prefix has mean h and variance v. The number of failed attempts before an advance is geometric with mean b−1 and variance b(b−1). A common reset, including the reset tile and return to that interface, has the same law as the prefix: resetting to B skips its forced first tile. A two-pad private reset instead has that law plus a_i−1 deterministic attachments. Conditional on failure, the private choice has probability 1/(b−1). The variance formula for a random sum yields the two-pad recurrence. In the one-pad case, conditional on failure the extra length is a Bernoulli variable with parameter (a_i−1)/2; the same calculation gives the ternary recurrence. Strong Markov independence applies at each return to the digit interface.

All moment calculations use arbitrary-precision integers. For independent blocks,

    E[L] = 1 + Σ M_i = N,       Var(L) = Σ Var(X_i).

Generated metadata is checked against regenerated glue rules and multiplicities before these formulas are trusted. The recurrences are also tested against independent exact rational Markov-chain solutions.

## Rigorous concentration certificates

The paper leaves the constant in its sufficiently-large-block-count statement unspecified. The app uses the following explicit conservative certificate. It is an implementation derivation, not a new claim attributed to the paper.

For a block with mean M and maximum residual mean at most H, let Q be the transient matrix and F=(I−Q)^(−1). Row sums of F are residual means, so FQ=F−I has row sums at most H−1. The nonnegative resolvent expansion, using commutation of F and FQ, gives

    E[z^X] = 1 + (z−1)e_s^T(I−zQ)^(−1)1
           ≤ 1 + M(z−1)/(1−(H−1)(z−1)).

For 0<λ<1/H, use e^λ−1≤λ/(1−λ) and log(1+u)≤u to obtain

    log E exp[λ(X−M)] ≤ MH λ^2/(1−Hλ).

The second-moment equations give E[X^2]≤(2H−1)M≤2HM. The inequality e^(−x)≤1−x+x^2/2 implies

    log E exp[−λ(X−M)] ≤ MH λ^2 ≤ MH λ^2/(1−Hλ).

For independent random blocks, define A=Σ M_i H_i and H_*=max H_i. Chernoff with λ=t/(2A+H_*t), followed by a union bound, gives

    P(|L−N|>t) ≤ 2 exp[−t^2/(4A+2H_*t)].

The revised one-pad blocks use H_i=M_i. Two-pad blocks use H_i=2M_i. Deterministic blocks contribute zero centered fluctuation and are omitted from A and H_*. The app also computes the exact Chebyshev bound Var(L)/t^2 and takes the smaller sufficient bound, capped at one. If variance is zero, the bound is zero.

### Exact probability comparison

Set t=εN and calculate R=t^2/(4A+2H_*t) as an exact rational. Let j=min(4096,floor R). Since e>2, min(1,2^(1−j)) is a valid upper bound on 2exp(−R). The exponent cap makes it weaker, never stronger. Thus certification compares rational numbers, not rounded floating-point probabilities. Inputs allow 0<ε,δ≤1/2, down to 10^(−1000).

For balanced blocks, max M_i≤2(N−1)/r and Σ M_i^2≤2(N−1)^2/r. For ε≤1/2 these give an exponent at least ε^2r/10 for revised one-pad blocks and ε^2r/20 for two-pad blocks. Let J=ceil(log_2(2/δ)), computed by integer doubling. A certified starting count is

    r = min(N−1, ceil(CJ/ε^2)),     C=10 (one-pad) or 20 (two-pad).

If r=N−1, all blocks have mean one and length is deterministic. A bounded search tries smaller counts while retaining a certified endpoint; it does not assume globally monotone tile costs or claim minimality. If the selected system costs at least N entries, automatic mode uses a deterministic length-N line at cost N. Manual block counts are retained exactly and clearly labelled if the sufficient bound exceeds δ. A loose bound does not prove the actual failure probability is too large.

## Examples and efficiency

Counts below include the single seed. Automatic examples use ε=0.25 and δ=0.05. These are concrete comparisons with version 2, not universal dominance claims for every parameter choice.

| Parameters | Mode | Previous charged count | Revised charged count | Revised distinct types |
| --- | --- | ---: | ---: | ---: |
| N=257, r=32 | One-pad | 193 | 161 | 161 |
| N=257, r=32 | Two-pad | 193 | 161 | 161 |
| N=10,000, automatic | One-pad | 2,916 | 2,431 | 1,900 |
| N=10,000, automatic | Two-pad | 2,593 | 2,377 | 2,377 |
| N=1,000,000, automatic | One-pad | 9,112 | 6,700 | 5,490 |
| N=1,000,000, automatic | Two-pad | 5,441 | 5,105 | 5,105 |

At N=257 and r=32 the revised variances are 1216 (one-pad) and 1152 (two-pad). Both manual examples remain uncertified at ε=0.25, δ=0.05 by the conservative bounds. Tile savings at a fixed block count do not imply identical length distributions. Automatic mode recomputes the block count to certify the requested δ.

For N=100 and one block, positive ternary has 13 charged entries, 11 distinct types and variance 9006. Revised two-pad base 3 has 12 equimolar entries and variance 9008. Both have mean 100.

## Exports, saved systems and large N

New generated systems include `construction.revision: 3`. Old exports without a revision retain the version-2 generators and certificates via `legacy-constructions.js`; importing an old literal system or compact recipe does not silently alter it. Regenerating creates the revised construction. Previously saved systems in Generate mode upgrade automatically on reload; imported/custom systems are preserved.

Constructions above 10,000 charged entries use a versioned compact recipe (`recipeOnly: true`), with no expanded tile list. Exact mean, variance, distinct count, charged count and certificate remain available. Such a recipe is not an inert-seed simulation, and literal trials/editing are disabled. Version-3 recipes require this updated app. Standard deviations, scientific notation, empirical results and finite-horizon PMFs are approximate; exact integer and rational strings are retained in Analysis and JSON exports.

The source test suite retains the original and legacy checks and adds independent solves for 300 revised one-pad blocks and 501 revised two-pad blocks, interface residual bounds, multiplicity accounting, block joins, certificate checks, huge targets through 10^1000, and old/new JSON compatibility. The deployment download contains website files, not the separate source test suite.
