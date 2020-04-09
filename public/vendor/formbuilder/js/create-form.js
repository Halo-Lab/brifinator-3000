      const controlOptions = {
        disable: {
            elements: ['button'],
            formActions: true,
        },
        elements: [
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'text',
                className: '',
                name:''
            },
            config: {
                label: 'Input text',
            },
            meta: {
                group: 'common',
                icon: '<svg class="svg-icon f-i-text-input"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#f-i-text-input"></use></svg>',
                id: 'text-input'
            },
        },
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'email',
                className: '',
                name:'email'
            },
            config: {
                label: 'Email',
            },
            meta: {
                group: 'common',
                icon: '@',
                id: 'email'
            },
        },
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'checkbox',
                className: '',
                name:''
            },
            config: {
                label: 'Checkbox Group',
            },
            meta: {
                group: 'common',
                icon: '<svg class="svg-icon f-i-checkbox"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#f-i-checkbox"></use></svg>',
                id: 'checkbox'
            },
            options: [
            {label: 'Option 1', value: 'opt1', selected: false, neme:''},
            {label: 'Option 2', value: 'opt2', selected: false, neme:''},
            ],
        },
        {
            tag: 'input',
            attrs: {
                required: false,
                type: 'radio',
                className: '',
                name:''
            },
            config: {
                label: 'Radio Group',
            },
            meta: {
                group: 'common',
                icon: '<svg class="svg-icon f-i-radio-group"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#f-i-radio-group"></use></svg>',
                id: 'radio'
            },
            options: [
            {label: 'Option 1', value: 'opt1', selected: false},
            {label: 'Option 2', value: 'opt2', selected: false},
            {label: 'Option 3', value: 'opt3', selected: false},
            ],
        }
        ],
    };

    const defaults_formeo = {
        editorContainer: '#formeo-editor',
        svgSprite: 'https://draggable.github.io/formeo/assets/img/formeo-sprite.svg',
        dataType: 'json',
        debug: true,
        controls: controlOptions,
    };

    const formData = window._form_builder_content ? JSON.parse(window._form_builder_content) : {};

    var formeo = new FormeoEditor(defaults_formeo, formData);



    jQuery(function() {
        $('#visibility').change(function(e) {
            e.preventDefault()
            var ref = $(this)

            if (ref.val() == "" || ref.val() == 'PUBLIC') {
                $('#allows_edit_DIV').hide()
            } else {
                $('#allows_edit_DIV').slideDown()
                $('#allows_edit').val('0')
            }
        });



        $("body").on("input", ".prev-label>label", function(){
            let field_id = $(this).closest("li").attr('id');
            let field_new_name = $(this).text().toLowerCase().replace(/\s+/g, '');

            $("#" + field_id + "-attrs-name").val(field_new_name);
            $("#prev-" + field_id).attr("name", field_new_name);
            formeo.formData.fields[field_id].attrs.name = field_new_name;

        });

    // ___________-------------------------------
    // create the form editor

    var fbClearBtn = $('.fb-clear-btn')
    var fbShowDataBtn = $('.fb-showdata-btn')
    var fbSaveBtn = $('.fb-save-btn')

    // setup the buttons to respond to save and clear
    fbClearBtn.click(function(e) {
        e.preventDefault()

        if ($.isEmptyObject(formeo.formData.fields)) return 
        // if (! formBuilder.actions.getData().length) return 

    sConfirm("Are you sure you want to clear all fields from the form?", function() {
        formBuilder.actions.clearFields()
    })
});

    fbShowDataBtn.click(function(e) {
        e.preventDefault()
        formBuilder.actions.showData()
    });

    fbSaveBtn.click(function(e) {
        e.preventDefault()

        var form = $('#createFormForm')

        // make sure the form is valid
        if ( ! form.parsley().validate() ) return 

            if($.isEmptyObject(formeo.formData.fields)){
                swal({
                    title: "Error",
                    text: "The form builder cannot be empty!!!!!",
                    icon: 'error',
                })
                return
            }



        // ask for confirmation
        sConfirm("Save this form definition?", function() {
            fbSaveBtn.attr('disabled', 'disabled');
            fbClearBtn.attr('disabled', 'disabled');

            var formBuilderJSONData = formeo.json;
            var method = form.data('formMethod') ? 'PUT' : 'POST';
            var hubspot_guid = $('#hubspot_guid').val();
            var portal_id = '';
            $.ajax({
                url: '/hubspot/save',
                dataType: 'json',
                async : false,
                data: {name: $('#name').val(), form_builder_json: formBuilderJSONData, _token: window.FormBuilder.csrfToken, hubspot_guid: hubspot_guid},
                method: method,
            })
            .done(function(response) {
                console.log("success");
                console.log(response);
                hubspot_guid = response.hubsput_guid;
                portal_id = response.portal_id;
                swal({
                    title: "Form Saved!",
                    text: response.details || '',
                    icon: 'success',
                })
            })
            .fail(function(response) {
                console.log("error");
                console.log("response",response);
            })
            .always(function(response) {
                console.log("complete");
                console.log('response ',response);
            });

            var postData = {
                name: $('#name').val(),
                visibility: $('#visibility').val(),
                allows_edit: $('#allows_edit').val(),
                is_template: $('#is_template').is(':checked') ? 1 : 0,
                template_name: $('#template_name').val(),
                form_builder_json: formBuilderJSONData,
                hubspot_guid: hubspot_guid,
                portal_id: portal_id,
                _token: window.FormBuilder.csrfToken
            }
            
            jQuery.ajax({
                url: form.attr('action'),
                processData: true,
                data: postData,
                method: method,
                cache: false,
            })
            .then(function(response) {
                fbSaveBtn.removeAttr('disabled')
                fbClearBtn.removeAttr('disabled')

                if (response.success) {
                    // the form has been created 
                    // send the user to the form index page
                    swal({
                        title: "Form Saved!",
                        text: response.details || '',
                        icon: 'success',
                    })

                    setTimeout(function() {
                        window.location = response.dest
                    }, 1500);

                } else {
                    swal({
                        title: "Error",
                        text: response.details || 'Error',
                        icon: 'error',
                    })
                }
            }, function(error) {
                handleAjaxError(error)

                fbSaveBtn.removeAttr('disabled')
                fbClearBtn.removeAttr('disabled')
            })
        })

    })

    // show the clear and save buttons
    $('#fb-editor-footer').slideDown()
})
