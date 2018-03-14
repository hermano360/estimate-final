import React from 'react'
import { PageReducer, QuotesReducer } from './reducers'

describe('Reducers',()=>{
  describe('PageReducer Tests', () => {
    it('should correctly change page', () => {
      const action = {
        type: 'CHANGE_PAGE',
        page: 'New Page!'
      }
      expect(PageReducer("", action)).toBe(action.page)
    })
    it('should default to previous state with invalid type', () => {
      const action = {
        type: 'Invalid',
        page: 'New Page!'
      }
      const previousState= "Previous State"
      expect(PageReducer(previousState, action)).toBe(previousState)
    })
  })

  describe('QuotesReducer Tests', () => {
    it('should default to previous state with invalid type', () => {
      const action = {
        type: 'Invalid'
      }
      const previousState= "Previous State"
      expect(QuotesReducer(previousState, action)).toBe(previousState)
    })

    it('should load quotes in correct format', () => {
      const action = {
        type: 'LOAD_QUOTES',
        quotes: [
          {quoteNumber: 4},
          {quoteNumber: 5}
        ]
      }

      const newQuoteShape = {
        4: {quoteNumber: 4},
        5: {quoteNumber: 5}
      }
      const previousState= {}

      expect(QuotesReducer(previousState, action)).toEqual(newQuoteShape)
    })

    it('should add new quote correctly', () => {
      const sampleAction = {
        type: 'ADD_NEW_QUOTE',
        number: 1
      }
      const newQuoteShape = {
        [sampleAction.number]: {
          address: "",
          city: "",
          customerFirstName: "",
          customerLastName: "",
          date: '',
          email: "",
          phone: "",
          scopeOfWork: "",
          quoteNumber: sampleAction.number,
          estimator: "",
          shoppingCart: [],
          state: "",
          zipcode: ""
        }
      }
      const previousState= {}

      expect(QuotesReducer(previousState, sampleAction)).toEqual(newQuoteShape)
    })

    it('should duplicate quote correctly', () => {
      const sampleAction = {
        type: 'DUPLICATE_QUOTE',
        number: 2,
        quote: {
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [],
          state: "CA",
          zipcode: "91010"
        }
      }

      const previousState= {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [],
          state: "CA",
          zipcode: "91010"
        }
      }

      const newQuoteShape = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [],
          state: "CA",
          zipcode: "91010"
        },
        [sampleAction.number]:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: sampleAction.number,
          estimator: "SampleEstimator",
          shoppingCart: [],
          state: "CA",
          zipcode: "91010"
        }
      }

      expect(QuotesReducer(previousState, sampleAction)).toEqual(newQuoteShape)
    })

    it('should add new item to shopping cart correctly', () => {
      const sampleAction = {
        type: 'ADD_TO_SHOPPING_CART',
        template: 'Sample',
        quoteNumber: 1,
        shoppingCart: [{
          specifications: 'Sample'
        }]
      }

      const previousState = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [],
          state: "CA",
          zipcode: "91010"
        }
      }

      const newQuoteShape = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [
            {
              ...sampleAction.shoppingCart[0],
              template: sampleAction.template,
              quantity: 0
            }
          ],
          state: "CA",
          zipcode: "91010"
        }
      }

      expect(QuotesReducer(previousState, sampleAction)).toEqual(newQuoteShape)
    })

    it('should remove item by number from shopping cart correctly', () => {
      const sampleAction = {
        type: 'REMOVE_FROM_SHOPPING_CART',
        itemNumber: 1,
        quoteNumber: 1,
      }

      const previousState = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [
            {
              specification: 'Sample Item Information',
              template: 'Sample Template',
              quantity: 0
            },
            {
              specification: 'Sample Item Information #2',
              template: 'Sample Template #2',
              quantity: 0
            }
          ],
          state: "CA",
          zipcode: "91010"
        }
      }

      const newQuoteShape = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [
            {
              specification: 'Sample Item Information #2',
              template: 'Sample Template #2',
              quantity: 0
            }
          ],
          state: "CA",
          zipcode: "91010"
        }
      }
      expect(QuotesReducer(previousState, sampleAction)).toEqual(newQuoteShape)
    })

    it('should update item quantity correctly', () => {
      const sampleAction = {
        type: 'UPDATE_ITEM_QUANTITY',
        itemNumber: 1,
        quoteNumber: 1,
        quantity: 5
      }

      const previousState = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [
            {
              specification: 'Sample Item Information',
              template: 'Sample Template',
              quantity: 0
            }
          ],
          state: "CA",
          zipcode: "91010"
        }
      }

      const newQuoteShape = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [
            {
              specification: 'Sample Item Information',
              template: 'Sample Template',
              quantity: sampleAction.quantity
            }
          ],
          state: "CA",
          zipcode: "91010"
        }
      }
      expect(QuotesReducer(previousState, sampleAction)).toEqual(newQuoteShape)
    })


    it('should update item keycode correctly', () => {
      const sampleAction = {
        type: 'UPDATE_ITEM_KEYCODE',
        itemNumber: 1,
        quoteNumber: 1,
        product : {
          specification: 'Some Product Info'
        }
      }

      const previousState = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [
            {
              specification: 'Sample Item Information',
              template: 'Sample Template',
              quantity: 0
            }
          ],
          state: "CA",
          zipcode: "91010"
        }
      }

      const newQuoteShape = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [
            {
              ...sampleAction.product,
              template: 'Sample Template',
              quantity: 0
            }
          ],
          state: "CA",
          zipcode: "91010"
        }
      }
      expect(QuotesReducer(previousState, sampleAction)).toEqual(newQuoteShape)
    })

    it('should update quote attribute correctly', () => {

      const sampleAction = {
        type: 'EDIT_QUOTE_ATTRIBUTE',
        quoteNumber: 1,
        attribute: 'email',
        value: 'Another Email'
      }

      const previousState = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: "SampleEmail",
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [],
          state: "CA",
          zipcode: "91010"
        }
      }

      const newQuoteShape = {
        1:{
          address: "SampleAddress",
          city: "SampleCity",
          customerFirstName: "SampleName",
          customerLastName: "SampleLastName",
          date: 'SampleDate',
          email: sampleAction.value,
          phone: "SamplePhone",
          scopeOfWork: "SampleSOW",
          quoteNumber: 1,
          estimator: "SampleEstimator",
          shoppingCart: [],
          state: "CA",
          zipcode: "91010"
        }
      }
      expect(QuotesReducer(previousState, sampleAction)).toEqual(newQuoteShape)
    })
  })
})
