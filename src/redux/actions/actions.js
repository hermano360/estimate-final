// separate actions according to redux key and combine using object destructuring

const PageActions = {
  changePage : (page) => {
    return {
      type: 'CHANGE_PAGE',
      page
    }
  }
}

const TaxActions = {
  changeTax : (tax) => {
    return {
      type: 'CHANGE_TAX',
      tax
    }
  }
}

const LaborActions = {
  changeLabor : (labor) => {
    return {
      type: 'CHANGE_LABOR',
      labor
    }
  }
}

const ExtraWorkActions = {
  changeExtraWork : (extraWork) => {
    return {
      type: 'CHANGE_EXTRA_WORK',
      extraWork
    }
  }
}

const EstimatorActions = {
  changeEstimator : (estimator) => {
    return {
      type: 'CHANGE_ESTIMATOR',
      estimator
    }
  }
}

const CategoryActions = {
  loadCategories : (categories) => {
    return {
      type: 'LOAD_CATEGORIES',
      categories
    }
  }
}

const ProductActions = {
  loadProducts : (products) => {
    return {
      type: 'LOAD_PRODUCTS',
      products
    }
  }
}

const QuoteNumberActions = {
  setQuoteNumber : (quoteNumber) => {
    return {
      type: 'SET_QUOTE_NUMBER',
      quoteNumber
    }
  }
}

const QuoteActions = {
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
  editQuoteAttribute: (quoteNumber, attribute, value) => {
    return {
      type: "EDIT_QUOTE_ATTRIBUTE",
      quoteNumber,
      attribute,
      value
    }
  }
}

const DOMNodesActions = {
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

const DatabaseQuoteNumberActions = {
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
