const validateForm = (e, formRef, callBack, passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) => {
    e.preventDefault();

    const ignoredInputTypes = ["text", "textarea", "password"]

    let formIsValid = true;
    const invalidInputs = [];
    const passIds = {};
    const formInputs = formRef.current.querySelectorAll("input:not([type='checkbox']), textarea");

    formInputs.forEach(x => {
        if (!x.value || x.value === "") {
            invalidInputs.push(x);
            formIsValid = false;
            x.classList.add("is-invalid");
        } else if (ignoredInputTypes.indexOf(x.type) === -1) {
            let exp = /regex/;
            if (x.type === "email") {
                exp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            } else if (x.type === "tel") {
                exp = /^(((\+44\s?\d{4}|\(?0\d{4}\)?)\s?\d{3}\s?\d{3})|((\+44\s?\d{3}|\(?0\d{3}\)?)\s?\d{3}\s?\d{4})|((\+44\s?\d{2}|\(?0\d{2}\)?)\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$|\+[0-9]{1,3} ?[0-9 ]{1,15}/;
            }
            if (!exp.test(x.value)) {
                x.classList.add("is-invalid");
                invalidInputs.push(x);
                formIsValid = false;
            } else {
                x.classList.remove("is-invalid");
            }
        } else {
            x.classList.remove("is-invalid");
        }

        if (x.dataset.passwordid) {
            if (!passIds[x.dataset.passwordid]) {
                passIds[x.dataset.passwordid] = []
            }
            passIds[x.dataset.passwordid].push(x);
        }
    });


    Object.keys(passIds).forEach(x => {
        if (!passIds[x].every(elm => {
            return elm.value === passIds[x][0].value;
        })) {
            formIsValid = false;
            passIds[x].slice(-1)[0].classList.add("is-invalid");
            invalidInputs.push(passIds[x].slice(-1)[0]);
        } else if (!passwordRequirements.test(passIds[x][0].value)) {
            formIsValid = false;
            passIds[x][0].classList.add("is-invalid");
            invalidInputs.push(passIds[x][0]);
        }
    });

    if (formIsValid) {
        callBack(formRef.current, invalidInputs);
    }
}

export default validateForm;