import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extender los matchers de Vitest con los de Testing Library
expect.extend(matchers);

// Mock para IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
});
window.IntersectionObserver = mockIntersectionObserver;

// Silenciar logs durante los tests
console.error = vi.fn();
console.warn = vi.fn();
console.log = vi.fn();