import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DødsboModal from '../components/DødsboModal';
import {IconButton,
        Container,
        TextField,
        Modal } from '@material-ui/core';
import { auth } from '../services/Firebase';
import firebase from '../services/Firebase';

        Enzyme.configure({ adapter: new Adapter() })


describe('testing DødsboModal component', () => {
    let wrapper: Enzyme.ShallowWrapper;
    beforeEach(() => { 
        wrapper = shallow(<DødsboModal />); 
        
    });

    it('When legg til medlem button pressed, new email field is added', async () => {
        //await auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
        const button = wrapper.find('#addMember');
        button.simulate('click');
        
        expect(wrapper.find(TextField)).toHaveLength(3);
    });

    it('Error: empty name field', () => {
        const button = wrapper.find('#submitButton');
        button.simulate('click');
        const nameField = wrapper.find('[label="Navn på dødsbo"]');
        //Error shows when input field is empty
        expect(nameField.prop('error')).toBe(true);
    });

    it('Filled in name field', () => {
        //Error does NOT show when input field is filled in
        const nameField = wrapper.find('[label="Navn på dødsbo"]');
        nameField.simulate('change', { target: { value: 'TestNavn' } });
        expect(wrapper.find('[helperText="Vennligt fyll inn alle felt merket med (*)"]')).toHaveLength(0);
    })


})