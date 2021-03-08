import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DødsboModal from '../components/DødsboModal';

import { auth } from '../services/Firebase';
import firebase from '../services/Firebase';

        Enzyme.configure({ adapter: new Adapter() })


describe('testing DødsboModal component', () => {
    let wrapper: Enzyme.ShallowWrapper;
    let submitButton: Enzyme.ShallowWrapper;
    let addMemberButton: Enzyme.ShallowWrapper;
    beforeEach(() => { 
        wrapper = shallow(<DødsboModal />); 
        submitButton = wrapper.find('#submitButton');
        addMemberButton = wrapper.find('#addMember');
    });

    test('When legg til medlem button pressed, new email field is added', async () => {
        addMemberButton.simulate('click');
        //Should find 3 text fields, (name, description, and one email address field)
        expect(wrapper.find('[label="Email Address"]')).toHaveLength(1);
    });

    test('Error: empty name field', () => {
        submitButton.simulate('click');
        const nameField = wrapper.find('[label="Navn på dødsbo"]');
        //Error shows when input field is empty
        expect(wrapper.find('[helperText="Vennligt fyll inn alle felt merket med (*)"]')).toHaveLength(1);
    });

    test('Filled in name field', () => {
        //Error does NOT show when input field is filled in
        const nameField = wrapper.find('[label="Navn på dødsbo"]');
        nameField.simulate('change', { target: { value: 'TestNavn' } });
        submitButton.simulate('click');
        expect(wrapper.find('[helperText="Vennligt fyll inn alle felt merket med (*)"]')).toHaveLength(0);
    });

    test('Nonexisting email address', () => {
        addMemberButton.simulate('click');
        const emailField = wrapper.find('[label="Email Address"]');
        emailField.simulate('change', { target: { value: 'testEmail@email.com' } });
        submitButton.simulate('click');
        expect(wrapper.find('[helperText="Denne eposten er ikke registrert som en bruker"]')).toHaveLength(1);
    })
})