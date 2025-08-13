import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import Cards from '../src/Cards';
import * as dataHook from '../customHooks/useSampleDataHook';

jest.mock('../customHooks/useSampleDataHook');

describe('Cards component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading initially', () => {
    (dataHook.default as jest.Mock).mockReturnValue(null);
    const { getByText } = render(<Cards />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders a list of cards', () => {
    (dataHook.default as jest.Mock).mockReturnValue([
      { id: '1', title: 'Card 1', description: 'Desc 1' },
      { id: '2', title: 'Card 2', description: 'Desc 2' },
    ]);
    const { getByText } = render(<Cards />);
    expect(getByText('Card 1')).toBeTruthy();
    expect(getByText('Desc 1')).toBeTruthy();
    expect(getByText('Card 2')).toBeTruthy();
    expect(getByText('Desc 2')).toBeTruthy();
  });

  it('shows scroll-to-top button after scrolling past threshold', async () => {
    (dataHook.default as jest.Mock).mockReturnValue(
      Array.from({ length: 30 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Card ${i + 1}`,
        description: `Desc ${i + 1}`,
      })),
    );

    const { getByTestId, getByText } = render(<Cards />);
    const flatList = getByTestId('flat-list');

    await act(async () => {
      fireEvent.scroll(flatList, {
        nativeEvent: {
          contentOffset: { y: 400 },
          contentSize: { height: 2000, width: 300 },
          layoutMeasurement: { height: 500, width: 300 },
        },
      });
    });

    await waitFor(() => {
      expect(getByText('↑ Top')).toBeTruthy();
    });
  });

it('shows scroll-to-top button and scrolls to top when pressed', async () => {
  (dataHook.default as jest.Mock).mockReturnValue(
    Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Card ${i + 1}`,
      description: `Desc ${i + 1}`,
    })),
  );

  const scrollSpy = jest
    .spyOn(require('react-native').FlatList.prototype, 'scrollToOffset')
    .mockImplementation(() => {});

  const { getByTestId, getByText } = render(<Cards />);
  const flatList = getByTestId('flat-list');

  await act(async () => {
    fireEvent.scroll(flatList, {
      nativeEvent: {
        contentOffset: { y: 400 },
        layoutMeasurement: { height: 800 },
        contentSize: { height: 2000, width: 100 },
      },
    });
  });

  const scrollTopButton = await waitFor(() => getByText('↑ Top'));
  fireEvent.press(scrollTopButton);

  expect(scrollSpy).toHaveBeenCalledWith({
    offset: 0,
    animated: true,
  });

  scrollSpy.mockRestore();
});
});
