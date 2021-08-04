const validateForm = (e, formRef, callBack, passwordRequirements = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/) => {
    e.preventDefault();

    const inputsNotCheckedByRegex = ["text", "textarea", "password", "checkbox"]

    let formIsValid = true;
    const invalidInputs = [];
    const validInputs = [];
    const values = {};
    const passIds = {};
    const formInputs = formRef.current.querySelectorAll("input, textarea");

    const updateOutput = (x) => {
        x.classList.remove("is-invalid");
        validInputs.push(x);
        values[x.id] = x.value
    }

    formInputs.forEach(x => {
        if (!x.value || x.value === "") {
            invalidInputs.push(x);
            formIsValid = false;
            x.classList.add("is-invalid");
        } else if (inputsNotCheckedByRegex.indexOf(x.type) === -1) {
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
                updateOutput(x);
            }
        } else if (x.type === "checkbox" && x.dataset.checkrequired && !x.checked) {
                x.classList.add("is-invalid");
                invalidInputs.push(x);
                formIsValid = false;
        } else {
            updateOutput(x);
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
        callBack({
            event: e,
            form: formRef.current,
            values: values,
            validInputs: validInputs,
            invalidInputs: invalidInputs
        });
    }
}

export default validateForm;