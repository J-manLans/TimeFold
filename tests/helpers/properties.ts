/** What the property tests share */

/** How many random cases each property tries, FC_RUNS raising it for a deeper hunt (`FC_RUNS=50000 npm test`) */
export const RUNS = Number(import.meta.env.FC_RUNS ?? 100)
