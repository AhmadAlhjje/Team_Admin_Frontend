import { describe, expect, it } from 'vitest';

import { ApiError, errorMessage, fieldErrors } from './api/errors';
import { moveItem } from './list';
import { parseId, suggestSlug } from './slug';

describe('moveItem', () => {
  it('moves an element without mutating the input', () => {
    const input = [1, 2, 3, 4];
    expect(moveItem(input, 0, 2)).toEqual([2, 3, 1, 4]);
    expect(moveItem(input, 3, 0)).toEqual([4, 1, 2, 3]);
    expect(input).toEqual([1, 2, 3, 4]);
  });

  it('ignores out-of-range moves', () => {
    expect(moveItem([1, 2], 0, 5)).toEqual([1, 2]);
    expect(moveItem([1, 2], -1, 0)).toEqual([1, 2]);
  });
});

describe('slug helpers', () => {
  it('suggests latin slugs', () => {
    expect(suggestSlug('Wafeer App')).toBe('wafeer-app');
    expect(suggestSlug('  Café & Co. 2  ')).toBe('cafe-co-2');
  });

  it('returns nothing for non-latin titles', () => {
    expect(suggestSlug('منصة وفير')).toBe('');
  });

  it('parses only positive integer IDs', () => {
    expect(parseId('42')).toBe(42);
    expect(parseId('0')).toBeNull();
    expect(parseId('4a')).toBeNull();
    expect(parseId('../users')).toBeNull();
  });
});

describe('API error mapping', () => {
  it('maps backend codes to Arabic messages', () => {
    expect(errorMessage(new ApiError(409, { code: 'IN_USE' }))).toContain('مرتبط');
    expect(errorMessage(new ApiError(0, null))).toContain('تعذّر الاتصال');
    expect(errorMessage(new ApiError(500, { code: 'SOMETHING_NEW' }))).toContain('غير متوقع');
  });

  it('maps field details onto form fields', () => {
    const error = new ApiError(409, {
      code: 'DUPLICATE_VALUE',
      details: [{ field: 'slug', messages: ['must be unique'] }],
    });
    expect(fieldErrors(error)).toEqual({ slug: 'هذه القيمة مستخدمة مسبقاً.' });
  });
});
