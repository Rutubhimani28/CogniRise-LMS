const init = { data: [] }

const reducer = (state = init, action) => {
  switch (action.type) {
    case 'updated': {
      return { ...state, data: action.payload }
    }

    default: {
      return state
    }
  }
}

export default reducer
