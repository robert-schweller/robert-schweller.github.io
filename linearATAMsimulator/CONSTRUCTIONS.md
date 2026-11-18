# Linear Assembly Lab — construction notes

Version 2, November 18, 2026. The constructions follow Sections 3–6 of the supplied project manuscript, *Linear Assemblies: Expected and High Probability* (`linear_assemblies (2).pdf`). The explicit probability certificate below supplies a conservative constant for the manuscript's sufficiently-large-constant statement. It is an implementation derivation, not an additional claim attributed to the manuscript.

## Model and conventions

A single seed grows east by irreversible successful tile attachments. Length L includes that seed. A one-pad tile binds by equality of noninert labels. A two-pad tile binds if either corresponding pair of pads matches; a double match is counted once. The inert label is ⊥. Within the compatible set, positive integer multiplicities determine probabilities. Charged cost is one seed plus all nonseed multiplicities. The three new families are equimolar, so their charged and distinct counts agree.

The four generator choices are:

| Choice | Construction | Guarantee |
| --- | --- | --- |
| Expected length · one-pad | Positive ternary of N−1, Section 3.1 | E[L] = N |
| Expected length · two-pad | Redundant base-b encoding and shared reset pool, Section 4 | E[L] = N |
| High probability · one-pad | Independent bijective-binary blocks, Sections 5–6 | E[L] = N; automatic mode certifies the requested tail bound |
| High probability · two-pad | Independent shared-pool blocks, Sections 4 and 6 | E[L] = N; automatic mode certifies the requested tail bound |

These are constructive upper bounds, not a search for minimum tile complexity. For N=1 the seed alone is terminal. A specified manual block count can be an uncertified concentration experiment; the interface says so explicitly.

## 1. Expected length with two pads

Set M=N−1. Choose b≥2. Compute

    M = h b^k + Σ(i=1..k) c_i b^(k−i),
    1 ≤ h ≤ 3b−2,     2b−1 ≤ c_i ≤ 3b−2,
    j_i = c_i−(2b−1) ∈ {0,…,b−1}.

Starting from x=M, while x>3b−2 remove the least significant coefficient

    c = 2b−1 + ((x−(2b−1)) mod b),     x ← (x−c)/b.

Reverse the removed coefficients; the remaining x is h. With an explicitly chosen base, the app uses that base. Auto compares bases 2 through max(16, ceil(2 sqrt(ln(M+1)))) and chooses the smallest literal count among those candidates (ties choose the smaller base). This includes the manuscript's sqrt(log)-scale base and does not promise global optimality.

All labels below are private to this block. Write d_0=q. The tile rules for k≥1 are:

| Tile | West pads | East pads |
| --- | --- | --- |
| Q | (q,⊥) | (v_1,⊥) if h>1; otherwise (⊥,u_0) |
| U_l, 1≤l<h−1 | (v_l,⊥) | (v_(l+1),⊥) |
| U_(h−1), if h>1 | (v_(h−1),⊥) | (⊥,u_0) |
| P_i, 1≤i≤k | (⊥,u_(i−1)) | (a,u_i) |
| R_i, 1≤i≤k | (⊥,u_i) | (d_(j_i),⊥) |
| D_j, 1≤j≤b−1 | (d_j,⊥) | (d_(j−1),⊥) |
| C_r, 1≤r≤b−2 | (a,ξ_r) | (q,⊥) |
| H | (⊥,u_k) | output |

The input interface is Q's **east** interface. The separate seed exposes this input. Each ξ_r occurs only on west pads. After P_i, there are exactly b equimolar choices: one advance (P_(i+1), or H at i=k), the private R_i reset, and b−2 common C_r resets. All other growth steps are deterministic. Q remains available for resets; it is not an extra starting seed.

The block has h+2k+2b−2 nonseed tile types and mean M attachments. If k=0, the app removes unnecessary reset machinery and uses a deterministic path of M attachments instead.

Example: N=100 and b=3 give M=99, h=1, coefficients [5,7,6], and j=[0,2,1]. There are 11 nonseed tile types plus the seed, so the total cost is 12. The exact variance is 9404.

### Exact two-pad variance

Treat returns to the input interface as renewal points. A successful attempt has length h+k and probability p=b^(−k). A reset at stage i has probability weight b^(k−i) after division by p. Its length is h+i+1 for each of the b−2 common choices, or h+i+j_i+1 for the private choice. Therefore

    A2/p = (h+k)^2 + Σ b^(k−i)[(b−2)(h+i+1)^2 + (h+i+j_i+1)^2],
    AF/p = Σ b^(k−i)[(b−2)(h+i+1) + h+i+j_i+1],
    Var(X) = A2/p + 2M(AF/p) − M^2,

where A2=E[A^2], AF=E[A·1_reset], and A is one attempt's length. This follows from X=A on success and X=A+X' on reset, with an independent fresh X'.

## 2. One-pad blocks for concentration

For an even mean M, encode M/2 in bijective binary:

    M/2 = Σ(i=1..k) d_i 2^(k−i),    d_i ∈ {1,2}.

The block input is q_1. At stage i choose equally between an advance and a reset to q_1; each branch has exactly d_i attachments:

| Digit | Advance branch | Reset branch |
| --- | --- | --- |
| 1 | q_i → q_(i+1) | q_i → q_1 |
| 2 | q_i → u_i → q_(i+1) | q_i → v_i → q_1 |

Every arrow is one equimolar tile type; u_i and v_i are private labels. For i=k, q_(k+1) means the block output interface. For odd M>1 prepend one forced tile to the even M−1 block; resets return to the even block's q_1, never to that prefix. M=1 is a single deterministic attachment.

Let M_e=M−(M mod 2), s_i=Σ(j≤i)d_j and D=s_k. The variance of the even core, and thus of the whole block, is

    Var(X) = D^2 + Σ 2^(k−i)s_i^2
             + 2M_e Σ 2^(k−i)s_i − M_e^2.

The nonseed cost is 2Σd_i plus one if M is odd. For M=1 it is one.

## 3. Concatenating independent blocks

Choose r∈{1,…,N−1}, and partition N−1 into r positive means differing by at most one. Each block gets its own namespace (`B1:`, `B2:`, …); all of its labels, including reset-pool labels, are private. Redirect every successful final tile to the next block's input. The last block outputs inert pads. There are no additional connector attachments and no additional seeds.

The block lengths X_i are independent, E[L]=1+ΣM_i=N, and Var(L)=ΣVar(X_i). All blocks terminate almost surely. At every reachable unfinished interface within either block family, the mean remaining time to that block's output is at most 2M_i, as in the manuscript's residual-mean bounds. Concatenation does not alter a block's local law before it reaches that output.

The one-pad N=257 example with ε=1/4 has numerical failure probabilities approximately 80.8%, 41.3%, and 5.5% for r=1,8,32 respectively. These are floating-point distribution calculations, not certified tail bounds.

## 4. An explicit probability certificate

Let X be a finite absorbing Markov-chain hitting time from a specified input, with mean M. Suppose every reachable nonterminal state's residual mean is at most H. For the implemented random blocks take H=2M. A deterministic block is omitted from centered tail calculations.

Write Q for the transient matrix and F=(I−Q)^(−1). Row sums of F are residual means, so FQ=F−I has row sums at most H−1. For z>1 sufficiently close to 1, the nonnegative resolvent series gives

    E[z^X] = 1 + (z−1)e_s^T(I−zQ)^(−1)1
           ≤ 1 + M(z−1)/(1−(H−1)(z−1)).

Here F commutes with FQ, and e_s^T F 1=M; these facts bound each term of the series by M(H−1)^j. For 0<λ<1/H, e^λ−1≤λ/(1−λ), and hence

    log E exp[λ(X−M)] ≤ MH λ^2/(1−Hλ).

Also, the second-moment equations imply E[X^2]≤(2H−1)M≤2HM. Using e^(−x)≤1−x+x^2/2 and log(1+u)≤u gives

    log E exp[−λ(X−M)] ≤ MH λ^2
                      ≤ MH λ^2/(1−Hλ).

For independent random blocks, set A=ΣM_iH_i=2ΣM_i^2 and H_*=max H_i=2M_max. Apply Chernoff on both sides with λ=t/(2A+H_*t):

    P(|L−N|>t) ≤ 2 exp[−t^2/(4A+2H_*t)]
               = 2 exp[−t^2/(8ΣM_i^2+4M_max t)].

For r balanced blocks and 0<ε≤1/2, taking t=εN gives the weaker convenient bound 2 exp(−ε^2 r/20): indeed M_max≤2(N−1)/r and ΣM_i^2≤2(N−1)^2/r. This remains a sufficient bound if deterministic blocks are omitted.

### Exact, conservative evaluation

No floating-point exponential is used to certify δ. Compute the exponent ratio R=t^2/(8ΣM_i^2+4M_max t) as a rational. Let j=min(4096,floor R). Since e>2, a valid upper bound is min(1,2^(1−j)); the exponent cap only makes the bound weaker. The app takes the minimum of that bound, 1, and the exact Chebyshev bound Var(L)/t^2. Deterministic systems get bound zero. All comparisons with ε and δ are exact rational comparisons.

To obtain a guaranteed starting choice, let J=ceil(log_2(2/δ)), calculated by integer doubling, and take

    r = min(N−1, ceil(20J/ε^2)).

If r=N−1, all blocks have mean one and the length is deterministic. Otherwise the preceding estimate certifies δ. A bounded binary search tries smaller block counts, always retaining a certified endpoint. No monotonicity or minimality of the actual tile cost is assumed. After this search, if the candidate costs at least N entries, automatic mode instead returns a deterministic length-N line at cost N. Manual mode keeps the requested r and reports whatever certificate it can prove.

Allowed inputs are 0<ε,δ≤1/2, down to 10^(−1000), in decimal, fraction, or scientific notation. The integer exponent cap 4096 is beyond the bits required for this smallest δ.

## 5. Large systems, exports and validation

The app preserves arbitrary-precision integers for N, block counts, tile counts, means and variances. A generated construction with more than 10,000 total entries is kept as a **compact recipe**, not a literal inert-seed system. Its `recipeOnly: true` JSON has no expanded tile rules. Import it into version 2 to recover the construction; older simulators do not support this recipe format. Literal trials and tile editing are intentionally unavailable for a recipe. The input metadata specifies all literal rules through the algorithms above, even if the list is too large to materialize.

For a materialized generated system, construction metadata is regenerated and compared with the actual glue rules before any special formula or certificate is trusted. Editing the rules invalidates that certificate and uses the ordinary custom-system analysis. N beyond 100,000 defaults to numerical display; graphical traces retain at most 5,000 attachments. PMF calculations use floating point and report residual mass. Empirical results distinguish terminal, capped and unstarted trials.

Automated tests independently solve the actual Markov chains for 400 two-pad blocks and 150 one-pad blocks, check residual means, private block handoffs and equimolar counts, reproduce the paper's examples, validate certificates, and exercise 10^1000 compact recipes and metadata tampering. The original one-pad and custom-model tests are retained. Run `node --test tests/*.test.js` from the source project.
