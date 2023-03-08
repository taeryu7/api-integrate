// useAsync 커스텀 Hook 만들어서 사용하기

/*
// 데이터 나중에 불러오기
POST, DELETE, PUT, PATCH 등의 HTTP 메서드를 사용하게 된다면 필요한 시점에만 API 를 호출해야 하기 때문에
필요할 때에만 요청 할 수 있는 기능이 필요하다.
*/
import { useReducer, useEffect } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = [], skip = false) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false
  });

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    if (skip) return;
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;
// skip 파라미터의 기본 값을 false 로 지정하고, 만약 이 값이 true 라면 useEffect 에서 아무런 작업도 하지 않도록 설정했다.


/*
// 매번 반복되는 코드를 작성하는 대신, 커스텀 Hook을 만들어서 요청상태 관리 로직을 쉽게 재사용해보자.

import { useReducer, useEffect } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// 두가지 파라메터를 받아오는 함수 useAsync
// 첫번째 파라미터는 API 요청을 시작하는 함수
// 두번째는 파라미터 deps인테 이 deps 값은 해당 함수안에 사용하는 useEffect의 deps로 설정
// 이 값은 나중에 사용 할 비동기 함수에서 파라미터가 필요하고, 그 파라미터가 바뀔 때 새로운 데이터를 불러오고 싶은 경우에 활용 할 수 있다.
//  값의 기본값은 []로 컴포넌트가 가장 처음 렌더링 할때만 API를 호출하고 싶다는 의미다.

function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false
  });

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;
*/
