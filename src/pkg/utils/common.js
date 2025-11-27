export const normalizeInput = (input) => {
      if (!input) return [];
      if (Array.isArray(input)) return input;
      if (typeof input === "object") return Object.values(input);
      if (typeof input === "string") return [input];
      return [];
};