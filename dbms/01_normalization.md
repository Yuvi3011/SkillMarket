# SkillMarket: Database Normalization Report (1NF → 2NF → 3NF → BCNF)

**Course:** Advanced Programming (AP) & Database Management Systems (DBMS)  
**Project:** SkillMarket (Peer-to-Peer Skill Marketplace & Skill Exchange Platform)  
**Team:** T0148 · **Section:** E · **Repository:** [SkillMarket](https://github.com/Yuvi3011/SkillMarket)  
**Team Members:** Yuvraj Babbar (Lead: 2501010539), Samriddhi (2501010403), Vansh Grover (2501010493), Udhav Munish Sehgal (2501010595)

---

## 1. Application Overview & Domain Model

**SkillMarket** is a peer-to-peer web application facilitating two operational modalities:
1. **Direct Marketplace:** Users discover and book specialized skill services (e.g. Web Development, UI/UX Design, Guitar Lessons) from peer providers at set hourly or fixed rates.
2. **Skill Exchange / Barter:** Users propose bilateral skill swaps (e.g. trading React Mentorship for Spanish Language Tutoring) without monetary transactions.

In addition to skill listings and swaps, the platform manages user authentication profiles, order tracking, schedule bookings, and post-session review/rating scoring.

---

## 2. Un-Normalized Form (UNF)

Initially, the entire platform activity is captured in a monolithic un-normalized relation containing non-atomic fields, multi-valued attributes, and repeating groups.

### UNF Relation: `UNF_SKILL_MARKET`
```text
UNF_SKILL_MARKET (
    user_id,
    user_name,
    user_email,
    user_bio,
    skills_offered: [ { skill_id, skill_name, category_id, category_name, proficiency_level, hourly_rate } ],
    orders: [ { order_id, client_id, client_name, client_email, skill_id, order_date, session_time, status, total_price } ],
    exchanges: [ { exchange_id, initiator_id, offered_skill_id, partner_id, requested_skill_id, exchange_status, initiated_at } ],
    reviews: [ { review_id, reviewer_id, reviewer_name, skill_id, rating, review_text, created_at } ]
)
```

### Anomalies in UNF:
- **Redundancy:** Client and user personal details are duplicated across every order and skill entry.
- **Repeating Groups:** An individual user can offer multiple skills, place multiple orders, and participate in multiple skill exchanges, violating relational atomicity.

---

## 3. First Normal Form (1NF)

### 3.1 Definition & Requirements
A relation is in **1NF** if and only if:
1. All attributes contain only atomic (indivisible) scalar values.
2. There are no repeating groups or arrays.
3. A unique primary key identifies every tuple.

### 3.2 1NF Transformation
We flatten the multi-valued attributes into discrete tuples by selecting a composite primary key.

```text
MARKET_1NF (
    user_id,
    user_name,
    user_email,
    user_bio,
    skill_id,
    skill_name,
    category_id,
    category_name,
    proficiency_level,
    hourly_rate,
    order_id,
    client_id,
    client_name,
    client_email,
    order_date,
    session_time,
    order_status,
    total_price,
    exchange_id,
    partner_id,
    offered_skill_id,
    requested_skill_id,
    exchange_status,
    review_id,
    reviewer_id,
    rating,
    review_text
)
```
- **Composite Primary Key:** `{ (user_id, skill_id, order_id, exchange_id, review_id) }`

### 3.3 Functional Dependencies in 1NF
- $\text{user\_id} \rightarrow \{ \text{user\_name}, \text{user\_email}, \text{user\_bio} \}$
- $\text{skill\_id} \rightarrow \{ \text{skill\_name}, \text{category\_id}, \text{category\_name} \}$
- $\text{category\_id} \rightarrow \{ \text{category\_name} \}$
- $\{ \text{user\_id}, \text{skill\_id} \} \rightarrow \{ \text{proficiency\_level}, \text{hourly\_rate} \}$
- $\text{order\_id} \rightarrow \{ \text{user\_id}, \text{client\_id}, \text{client\_name}, \text{client\_email}, \text{skill\_id}, \text{order\_date}, \text{session\_time}, \text{order\_status}, \text{total\_price} \}$
- $\text{exchange\_id} \rightarrow \{ \text{user\_id}, \text{partner\_id}, \text{offered\_skill\_id}, \text{requested\_skill\_id}, \text{exchange\_status} \}$
- $\text{review\_id} \rightarrow \{ \text{order\_id}, \text{reviewer\_id}, \text{rating}, \text{review\_text} \}$

### 3.4 Anomalies Remaining in 1NF
- **Insertion Anomaly:** A new skill category cannot be registered in the system unless at least one user lists a skill in that category and places an order.
- **Deletion Anomaly:** If the only order for a specific skill is deleted, all historical listing metadata for that skill could be permanently lost.
- **Update Anomaly:** Updating a client's email address requires modifying multiple rows across all past orders placed by that client.

---

## 4. Second Normal Form (2NF)

### 4.1 Definition & Requirements
A relation is in **2NF** if and only if:
1. It is in 1NF.
2. Every non-prime attribute is **fully functionally dependent** on the primary key (no partial functional dependencies where an attribute depends on a proper subset of a composite candidate key).

### 4.2 Eliminating Partial Dependencies
The composite key `{ (user_id, skill_id, order_id, exchange_id, review_id) }` exhibited numerous partial dependencies:
- $\{ \text{user\_name}, \text{user\_email} \}$ depended solely on $\text{user\_id}$.
- $\{ \text{skill\_name}, \text{category\_id} \}$ depended solely on $\text{skill\_id}$.
- $\{ \text{proficiency\_level}, \text{hourly\_rate} \}$ depended on $\{ \text{user\_id}, \text{skill\_id} \}$.
- Order details depended solely on $\text{order\_id}$.
- Exchange details depended solely on $\text{exchange\_id}$.

We decompose the 1NF schema into separate relations based on their full functional dependencies:

```text
1. USERS_2NF (
    user_id [PK],
    user_name,
    user_email,
    user_bio
)

2. SKILLS_2NF (
    skill_id [PK],
    skill_name,
    category_id,
    category_name
)

3. USER_SKILLS_2NF (
    user_id [PK, FK],
    skill_id [PK, FK],
    proficiency_level,
    hourly_rate
)

4. ORDERS_2NF (
    order_id [PK],
    client_id,
    client_name,
    client_email,
    provider_id,
    skill_id,
    order_date,
    session_time,
    order_status,
    total_price
)

5. EXCHANGES_2NF (
    exchange_id [PK],
    initiator_id,
    partner_id,
    offered_skill_id,
    requested_skill_id,
    exchange_status,
    initiated_at
)

6. REVIEWS_2NF (
    review_id [PK],
    order_id,
    reviewer_id,
    rating,
    review_text
)
```

### 4.3 Anomalies Remaining in 2NF (Transitive Dependencies)
- In `SKILLS_2NF`: $\text{skill\_id} \rightarrow \text{category\_id}$ and $\text{category\_id} \rightarrow \text{category\_name}$. The non-key attribute $\text{category\_name}$ transitively depends on $\text{skill\_id}$ via $\text{category\_id}$.
- In `ORDERS_2NF`: $\text{order\_id} \rightarrow \text{client\_id}$ and $\text{client\_id} \rightarrow \{ \text{client\_name}, \text{client\_email} \}$. Client personal details transitively depend on $\text{order\_id}$.

---

## 5. Third Normal Form (3NF)

### 5.1 Definition & Requirements
A relation is in **3NF** if and only if:
1. It is in 2NF.
2. There are **no transitive functional dependencies** for non-prime attributes (i.e. if $X \rightarrow Y$ and $Y \rightarrow Z$, then $X \rightarrow Z$ is eliminated by decomposing into separate relations).

Formally, for every functional dependency $X \rightarrow A$, at least one holds:
- $A \in X$ (trivial dependency).
- $X$ is a superkey.
- $A$ is a prime attribute (part of a candidate key).

### 5.2 3NF Decomposition
1. **Extracted `CATEGORIES`** from `SKILLS_2NF`:
   - Eliminates $\text{category\_id} \rightarrow \text{category\_name}$.
2. **Normalized Client References** in `ORDERS_2NF`:
   - Replaced redundant client attributes with a direct foreign key $\text{client\_id}$ referencing `USERS(user_id)`.

```text
1. USERS_3NF (
    user_id [PK],
    user_name,
    user_email [UQ],
    user_bio
)

2. CATEGORIES_3NF (
    category_id [PK],
    category_name,
    category_slug
)

3. SKILLS_3NF (
    skill_id [PK],
    skill_name,
    category_id [FK]
)

4. USER_SKILLS_3NF (
    user_id [PK, FK],
    skill_id [PK, FK],
    proficiency_level,
    hourly_rate
)

5. ORDERS_3NF (
    order_id [PK],
    client_id [FK],
    provider_id [FK],
    skill_id [FK],
    order_date,
    session_time,
    order_status,
    total_price
)

6. EXCHANGES_3NF (
    exchange_id [PK],
    initiator_id [FK],
    partner_id [FK],
    offered_skill_id [FK],
    requested_skill_id [FK],
    exchange_status,
    initiated_at
)

7. REVIEWS_3NF (
    review_id [PK],
    order_id [FK],
    reviewer_id [FK],
    rating,
    review_text,
    created_at
)
```

---

## 6. Boyce-Codd Normal Form (BCNF)

### 6.1 Definition & Requirements
A relation $R$ is in **BCNF** if and only if:
For every non-trivial functional dependency $X \rightarrow Y$, **$X$ is a superkey** of $R$. BCNF eliminates anomalies arising from overlapping candidate keys.

### 6.2 BCNF Verification per Relation

#### 1. `USERS`
- **Candidate Keys:** $\{ \text{user\_id} \}$, $\{ \text{user\_email} \}$
- **FDs:**
  - $\text{user\_id} \rightarrow \{ \text{user\_name}, \text{user\_email}, \text{user\_bio} \}$
  - $\text{user\_email} \rightarrow \{ \text{user\_id}, \text{user\_name}, \text{user\_bio} \}$
- **Verification:** Both determinants $\text{user\_id}$ and $\text{user\_email}$ are candidate superkeys. **Complies with BCNF.**

#### 2. `CATEGORIES`
- **Candidate Keys:** $\{ \text{category\_id} \}$, $\{ \text{category\_name} \}$
- **FDs:** $\text{category\_id} \rightarrow \{ \text{category\_name}, \text{category\_slug} \}$
- **Verification:** Determinant is a superkey. **Complies with BCNF.**

#### 3. `SKILLS`
- **Candidate Keys:** $\{ \text{skill\_id} \}$, $\{ (\text{skill\_name}, \text{category\_id}) \}$
- **FDs:** $\text{skill\_id} \rightarrow \{ \text{skill\_name}, \text{category\_id} \}$
- **Verification:** Determinant is a superkey. **Complies with BCNF.**

#### 4. `USER_SKILLS`
- **Candidate Keys:** $\{ (\text{user\_id}, \text{skill\_id}) \}$
- **FDs:** $\{ \text{user\_id}, \text{skill\_id} \} \rightarrow \{ \text{proficiency\_level}, \text{hourly\_rate} \}$
- **Verification:** Determinant is the primary key. **Complies with BCNF.**

#### 5. `ORDERS`
- **Candidate Keys:** $\{ \text{order\_id} \}$
- **FDs:** $\text{order\_id} \rightarrow \{ \text{client\_id}, \text{provider\_id}, \text{skill\_id}, \text{order\_date}, \text{session\_time}, \text{order\_status}, \text{total\_price} \}$
- **Verification:** Determinant is a superkey. **Complies with BCNF.**

#### 6. `EXCHANGES`
- **Candidate Keys:** $\{ \text{exchange\_id} \}$
- **FDs:** $\text{exchange\_id} \rightarrow \{ \text{initiator\_id}, \text{partner\_id}, \text{offered\_skill\_id}, \text{requested\_skill\_id}, \text{exchange\_status}, \text{initiated\_at} \}$
- **Verification:** Determinant is a superkey. **Complies with BCNF.**

#### 7. `REVIEWS`
- **Candidate Keys:** $\{ \text{review\_id} \}$, $\{ \text{order\_id} \}$ (Each order can receive at most one review)
- **FDs:**
  - $\text{review\_id} \rightarrow \{ \text{order\_id}, \text{reviewer\_id}, \text{rating}, \text{review\_text}, \text{created\_at} \}$
  - $\text{order\_id} \rightarrow \{ \text{review\_id}, \text{reviewer\_id}, \text{rating}, \text{review\_text}, \text{created\_at} \}$
- **Verification:** Both determinants are candidate superkeys. **Complies with BCNF.**

---

## 7. Summary & Normalization Comparison

| Normal Form | Problem Solved | Key Characteristic in SkillMarket |
|---|---|---|
| **UNF** | Initial raw collection | Contains arrays, repeating groups of skills/orders |
| **1NF** | Atomicity achieved | Flat schema with composite PK `{ (user_id, skill_id, order_id, exchange_id, review_id) }` |
| **2NF** | Partial dependencies removed | Decomposed into entities (`Users`, `Skills`, `UserSkills`, `Orders`, `Exchanges`, `Reviews`) |
| **3NF** | Transitive dependencies eliminated | Extracted `Categories` relation and client references to ensure non-key independence |
| **BCNF** | Overlapping candidate key anomalies resolved | Verified that every determinant (including natural keys like `user_email` and `order_id` in reviews) is a superkey |

The resulting relational schema represents a lossless-join, dependency-preserving, BCNF-compliant data model ready for PostgreSQL implementation.
