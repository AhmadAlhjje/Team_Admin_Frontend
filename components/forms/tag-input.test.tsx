// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import { TagInput } from './tag-input';

function Harness({ initial = [] as string[] }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <label htmlFor="tags">Tags</label>
      <TagInput id="tags" value={value} onChange={setValue} />
      <output data-testid="value">{value.join('|')}</output>
    </>
  );
}

describe('TagInput', () => {
  it('adds tags with Enter and comma, ignoring case-insensitive duplicates', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const input = screen.getByLabelText('Tags');

    await user.type(input, 'React{Enter}');
    await user.type(input, 'NestJS,');
    await user.type(input, 'react{Enter}');

    expect(screen.getByTestId('value')).toHaveTextContent('React|NestJS');
  });

  it('removes tags with the remove button and with Backspace', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['React', 'NestJS', 'Prisma']} />);

    await user.click(screen.getByRole('button', { name: 'إزالة NestJS' }));
    expect(screen.getByTestId('value')).toHaveTextContent('React|Prisma');

    await user.click(screen.getByLabelText('Tags'));
    await user.keyboard('{Backspace}');
    expect(screen.getByTestId('value')).toHaveTextContent('React');
  });
});
