import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DødsboModal from '../components/DødsboModal';
import {IconButton,
        Container,
        TextField,
        Modal } from '@material-ui/core';

        Enzyme.configure({ adapter: new Adapter() })


describe('testing DødsboModal component', () => {
    let wrapper: Enzyme.ShallowWrapper;
    beforeEach(() => { wrapper = shallow(<DødsboModal />); });
    it('When legg til medlem button pressed, new email field is added', () => {
        const button = wrapper.find('#addMember');
        button.simulate('click');
        
        expect(wrapper.find(TextField)).toHaveLength(3);
    });
})