import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../src/Card';

describe('Card component', () => {
  it('renders title and description correctly', () => {
    const { getByText, getByTestId } = render(
      <Card title="Test Title" description="Test Description" />
    );

    expect(getByTestId('card')).toBeTruthy();
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });
});