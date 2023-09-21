import React, { useState, useCallback, useMemo } from 'react';

import debounce from '../../helpers/debounce';
import api from '../../helpers/api';
import normalizeSuggestions from '../../helpers/normalize-suggestions';
import getClassNames from '../../helpers/get-class-names';
import { DELAY_500, KEYS } from '../../consts';
import spinner from './spinner.gif';
import './styles.css';

const defaultIndex = -1;

const Search = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(defaultIndex);
  const [loading, setLoading] = useState<boolean>(false);

  const getSuggestions = useMemo(
    () =>
      debounce((value: string) => {
        if (value) {
          setLoading(true);
          api.post('search', { query: value }).then((result) => {
            setOptions(normalizeSuggestions(result.data));
            setLoading(false);
          });
        } else {
          setOptions([]);
        }
      }, DELAY_500),
    []
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setInputValue(value);
      getSuggestions(value);
    },
    [getSuggestions]
  );

  const selectOption = useCallback((value: string) => {
    setInputValue(value);
    setActiveIndex(defaultIndex);
    setOptions([]);
  }, []);

  const getOption = useCallback(
    (value: string, index: number) => (
      <div
        key={value}
        onClick={() => selectOption(value)}
        onMouseOver={() => setActiveIndex(index)}
        className={getClassNames('option', index === activeIndex && 'active')}
      >
        {value}
      </div>
    ),
    [selectOption, activeIndex]
  );

  const lastIndex = options.length - 1;
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const hasActiveOption = activeIndex >= 0;

      if (event.key === KEYS.UP) {
        const newIndex = hasActiveOption ? activeIndex - 1 : activeIndex;

        setActiveIndex(newIndex);
        setInputValue(options[newIndex]);
        event.preventDefault();
      }

      if (event.key === KEYS.DOWN) {
        const increment = activeIndex + 1;
        const newIndex = increment > lastIndex ? lastIndex : increment;

        setActiveIndex(newIndex);
        setInputValue(options[newIndex]);
      }

      if (event.key === KEYS.ENTER && hasActiveOption) {
        selectOption(options[activeIndex]);
      }
    },
    [activeIndex, setInputValue, lastIndex, selectOption, options]
  );

  return (
    <div className="autocomplete">
      <input
        value={inputValue}
        placeholder="Search"
        autoFocus
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleSearchChange(event.target.value)
        }
        onKeyDown={onKeyDown}
        className="input"
      />
      {loading && <img src={spinner} alt="loading" className="spinner" />}
      <div className="options">{options.map(getOption)}</div>
    </div>
  );
};

export default Search;
