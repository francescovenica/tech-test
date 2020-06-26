import React from 'react';
import { shallow } from 'enzyme';

import App from '..';
import { addPunteggio } from '../../../services/punteggio';

jest.mock('../../../services/punteggio', () => ({
  addPunteggio: jest.fn(),
}))

describe('Home', () => {

  it('renderizza il pulsante nuova partite', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('#test-btn-new')).toHaveLength(1);
  });

  it('renders the app', () => {
    const wrapper = shallow(<App />);
    wrapper.find('#test-btn-new').simulate('click');
    wrapper.find('#test-btn-stop').simulate('click');
    wrapper.find('.form').first().simulate('submit', { preventDefault: () => {} });
    expect(addPunteggio.mock.calls).toHaveLength(1);
  });
  
})