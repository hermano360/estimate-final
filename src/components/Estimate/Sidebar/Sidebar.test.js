import React from 'react';
import {Sidebar} from './Sidebar'

describe('Handle Events',()=>{
  it('should work', () => {
    let wrapper = shallow(<Sidebar/>)
    expect(wrapper.instance().firstTest()).toBe('success!')
  })
})
