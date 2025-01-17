import { useBaseChannelsList } from "@saleor/channels/queries";
import chunk from "lodash-es/chunk";
import compact from "lodash-es/compact";
import concat from "lodash-es/concat";
import { useEffect, useState } from "react";

import {
  ChannelsWithLoadMoreProps,
  useChannelsSearch
} from "./useChannelsSearch";

const DEFAULT_ITEMS_PER_PAGE = 6;
const INITIAL_INDEX = 0;

export const useChannelsSearchWithLoadMore = (
  itemsPerPage: number = DEFAULT_ITEMS_PER_PAGE
): ChannelsWithLoadMoreProps => {
  const { data, loading } = useBaseChannelsList({});

  const {
    query,
    onQueryChange: onSearchChange,
    filteredChannels
  } = useChannelsSearch(data?.channels);

  const allChannelsChunks = chunk(filteredChannels, itemsPerPage);

  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [currentChannelsChunks, setCurrentChannelsChunks] = useState([]);

  const handleAddInitialChunk = () => {
    if (data?.channels && !loading) {
      setCurrentChannelsChunks([allChannelsChunks[INITIAL_INDEX]]);
    }
  };

  useEffect(handleAddInitialChunk, [loading, query]);

  const onFetchMore = () => {
    if (!hasMore) {
      return;
    }

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    const newChunk = allChannelsChunks[newIndex];
    setCurrentChannelsChunks([...currentChannelsChunks, newChunk]);
  };

  const hasMore = allChannelsChunks.length > currentChannelsChunks.length;

  const channels = compact(concat([], ...currentChannelsChunks));

  const totalCount = data?.channels.length;

  return {
    query,
    onSearchChange,
    channels,
    hasMore,
    totalCount,
    onFetchMore,
    loading
  };
};
