// separate actions according to redux key and combine using object destructuring

export const PageActions = {
  changePage : (page) => {
    return {
      type: 'CHANGE_PAGE',
      page
    }
  }
}

export const TaxActions = {
  changeTax : (tax) => {
    return {
      type: 'CHANGE_TAX',
      tax
    }
  }
}

export const LaborActions = {
  changeLabor : (labor) => {
    return {
      type: 'CHANGE_LABOR',
      labor
    }
  }
}

export const MaterialActions = {
  changeMaterial : (material) => {
    return {
      type: 'CHANGE_MATERIAL',
      material
    }
  }
}

export const ExtraWorkActions = {
  changeExtraWork : (extraWork) => {
    return {
      type: 'CHANGE_EXTRA_WORK',
      extraWork
    }
  }
}

export const EstimatorActions = {
  changeEstimator : (estimator) => {
    return {
      type: 'CHANGE_ESTIMATOR',
      estimator
    }
  }
}

export const CategoryActions = {
  loadCategories : (categories) => {
    return {
      type: 'LOAD_CATEGORIES',
      categories
    }
  }
}

export const ProductActions = {
  loadProducts : (products) => {
    return {
      type: 'LOAD_PRODUCTS',
      products
    }
  }
}

export const QuoteNumberActions = {
  setQuoteNumber : (quoteNumber) => {
    return {
      type: 'SET_QUOTE_NUMBER',
      quoteNumber
    }
  }
}

export const QuoteActions = {
  loadQuotes : (quotes) => {
    return {
      type: 'LOAD_QUOTES',
      quotes
    }
  },
  duplicateQuote: (quote, number) => {
    return {
      type: 'DUPLICATE_QUOTE',
      quote,
      number
    }
  },
  addNewQuote: (number) => {
    return {
      type: 'ADD_NEW_QUOTE',
      number
    }
  },
  addToShoppingCart: (shoppingCart, quoteNumber, template) => {
    return {
      type: "ADD_TO_SHOPPING_CART",
      shoppingCart,
      quoteNumber,
      template
    }
  },
  removeFromShoppingCart: (itemNumber, quoteNumber) => {
    return {
      type: "REMOVE_FROM_SHOPPING_CART",
      itemNumber,
      quoteNumber
    }
  },
  updateItemQuantity: (itemNumber, quoteNumber, quantity) => {
    return {
      type: "UPDATE_ITEM_QUANTITY",
      itemNumber,
      quoteNumber,
      quantity
    }
  },
  updateItemKeyCode: (itemNumber, quoteNumber, product) => {
    return {
      type: "UPDATE_ITEM_KEYCODE",
      itemNumber,
      quoteNumber,
      product
    }
  },
  editQuoteAttribute: (quoteNumber, attribute, value) => {
    return {
      type: "EDIT_QUOTE_ATTRIBUTE",
      quoteNumber,
      attribute,
      value
    }
  }
}

export const DOMNodesActions = {
  setShoppingCartNode: (key, node) => {
    return {
      type: 'SET_SHOPPING_CART_NODE',
      key,
      node
    }
  },
  setProductShoppingCartNode: (itemNumber, node) => {
    return {
      type: 'SET_PRODUCT_SHOPPING_CART_NODE',
      itemNumber,
      node
    }
  },
  clearShoppingCartNode: () => {
    return {
      type: 'CLEAR_SHOPPING_CART_NODE'
    }
  }
}

export const DatabaseQuoteNumberActions = {
  loadDatabaseQuoteNumbers: (databaseQuotes) => {
    return {
      type: 'LOAD_DATABASE_QUOTE_NUMBERS',
      databaseQuotes
    }
  }
}

const actions = {
  ...PageActions,
  ...TaxActions,
  ...LaborActions,
  ...MaterialActions,
  ...ExtraWorkActions,
  ...EstimatorActions,
  ...CategoryActions,
  ...ProductActions,
  ...QuoteNumberActions,
  ...QuoteActions,
  ...DOMNodesActions,
  ...DatabaseQuoteNumberActions
}

export default actions
