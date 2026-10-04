// Route-level code splitting. The same loader functions are used by React.lazy and by link prefetching,
// so a chunk requested on hover / JOIN is already cached when the route renders.
export const loaders = {
  hub: () => import("./hub"),
  work: () => import("./workpage"),
  impact: () => import("./impact"),
  experience: () => import("./experience"),
  profile: () => import("./profilepage"),
  detail: () => import("./ProjectDetail"),
};

const table = [
  [/^\/main\/?$/, "hub"],
  [/^\/main\/work\/?$/, "work"],
  [/^\/main\/work\/[\w-]+\/?$/, "detail"],
  [/^\/main\/impact\/?$/, "impact"],
  [/^\/main\/experience\/?$/, "experience"],
  [/^\/main\/profile\/?$/, "profile"],
];

export function preloadRoute(to) {
  const path = String(to).split("#")[0].split("?")[0];
  const hit = table.find(([re]) => re.test(path));
  return hit ? loaders[hit[1]]() : Promise.resolve();
}
