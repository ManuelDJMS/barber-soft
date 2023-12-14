"use strict";
var KTUsersList = (function () {
    /*Variables*/
    var table_items,
        table_permissions,
        btn_modal,
        btn_cancel,
        btn_submit,
        btn_add_permission,
        modal,
        modal_permission,
        validations,
        form,
        edit_name,
        edit_user_name,
        edit_last_name,
        edit_address,
        edit_phone,
        edit_id,
        n,
        select_permission,
        delete_permission = () => {
            document.querySelectorAll('[data-kt-customer-table-filter="delete_row"]').forEach((e) => {
                e.addEventListener("click", function (e) {
                e.preventDefault();
                const o = e.target.closest("tr"),
                    n = o.querySelectorAll("td")[0].innerText;
                Swal.fire({
                    text: "Seguro que deseas eliminar el permiso " + n + "?",
                    icon: "warning",
                    showCancelButton: !0,
                    buttonsStyling: !1,
                    confirmButtonText: "Si, borrar!",
                    cancelButtonText: "No, cancelelar",
                    customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary",
                    },
                }).then(function (e) {
                    e.value
                    ? Swal.fire({
                        text: "Eliminado correctamente!.",
                        icon: "success",
                        buttonsStyling: !1,
                        confirmButtonText: "Entendido",
                        customClass: { confirmButton: "btn fw-bold btn-primary" },
                        }).then(function () {
                        table_permissions.row($(o)).remove().draw();
                        })
                    : "cancel" === e.dismiss &&
                        Swal.fire({
                        text: "El permiso "+ n + " no se elimino.",
                        icon: "error",
                        buttonsStyling: !1,
                        confirmButtonText: "Entendido",
                        customClass: { confirmButton: "btn fw-bold btn-primary" },
                        });
                });
                });
            });
        },
        edit = () => {
            n.querySelectorAll(
                '[data-kt-user-table-filter="edit"]'
            ).forEach((e) => {
                e.addEventListener("click", function (e) {
                    e.preventDefault();
                    $.get("users/"+ $(this).data("id") + "/edit", function(data){
                        edit_name.value=data.user.name;
                        edit_id.value=data.user.id;
                        edit_user_name.value=data.user.username;
                        edit_address.value=data.user.address;
                        edit_phone.value=data.user.phone;
                        edit_last_name.value=data.user.last_name;
                        modal.show();
                    })
                });
            });
            n.querySelectorAll(
                '[data-kt-user-table-filter="permissions"]'
            ).forEach((e) => {
                e.addEventListener("click", function (e) {
                    e.preventDefault();
                    // GET USER PERMISSION
                    $.ajax({
                        url: "get_user_permission",
                        type: "GET",
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        data: {
                            user_id:$(this).data("id")
                        },
                        success: function (result) {
                            $.each(result.user, function(index){
                                table_permissions.row.add([result.user[index], `<button type="button" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1" data-kt-customer-table-filter="delete_row">
                                <span class="svg-icon svg-icon-5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"/>
                                <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"/>
                                <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"/>
                                </svg></span>
                            </button>`]).draw();
                            });
                            delete_permission();
                            Swal.close();
                            modal_permission.show();
                        },
                        beforeSend(){
                            Swal.fire({
                                title: "<strong>Cargando</strong>",
                                html: `<div class="progress container-fluid"></div>`,
                                showConfirmButton: false,
                                });
                        },
                        error(data){
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Ocurrio un error en la base de datos!",
                            });
                                console.log(data);
                        }
                    });

                });
            });
        },
        delete_items = () => {
            const e = n.querySelectorAll('[type="checkbox"]'),
                o = document.querySelector(
                    '[data-kt-user-table-select="delete_selected"]'
                );
            e.forEach((t) => {
                t.addEventListener("click", function () {
                    setTimeout(function () {
                        uncheck();
                    }, 50);
                });
            }),
            o.addEventListener("click", function () {
                let arr_items_deleted=[];
                e.forEach((e) => {
                    e.checked && arr_items_deleted.push($(e).data("id"));
                });
                console.log(arr_items_deleted);
                Swal.fire({
                    text: "Estas seguro de eliminar los registros seleccionados?",
                    icon: "warning",
                    showCancelButton: !0,
                    buttonsStyling: !1,
                    confirmButtonText: "Si, eliminar!",
                    cancelButtonText: "No, cancelar",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary",
                    },
                }).then(function (o) {
                    o.value
                    ?
                    $.ajax({
                        url: "destroy_users",
                        type: "POST",
                        dataType:"json",
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        data: {
                            ids:arr_items_deleted
                        },
                        success: function (result) {
                            Swal.fire({
                                text: "Datos eliminados correctamente!",
                                icon: "success",
                                buttonsStyling: !1,
                                confirmButtonText:"Entendido!",
                                customClass: {
                                    confirmButton:"btn btn-primary",
                                },
                            }).then(function (e) {
                                e.isConfirmed && table_items.ajax.reload();
                            });
                        },
                        beforeSend(){
                            Swal.fire({
                                title: "<strong>Cargando</strong>",
                                html: `<div class="progress container-fluid"></div>`,
                                showConfirmButton: false,
                            });
                        },
                        error(data){
                            Swal.fire({
                                icon: "error",
                                title: "Error",
                                text: "Ocurrio un error en la base de datos!",
                            });
                                console.log(data);
                        }
                    })

                    : "cancel" === o.dismiss &&
                        Swal.fire({
                            text: "Los registros no se eliminaron.",
                            icon: "error",
                            buttonsStyling: !1,
                            confirmButtonText: "Entendido!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary",
                            },
                        });
                });
            });
        };
        const uncheck = () => {
            const t = document.querySelector(
                    '[data-kt-user-table-toolbar="base"]'
                ),
                e = document.querySelector(
                    '[data-kt-user-table-toolbar="selected"]'
                ),
                o = document.querySelector(
                    '[data-kt-user-table-select="selected_count"]'
                ),
                c = n.querySelectorAll('tbody [type="checkbox"]');
            let r = !1,
                l = 0;
            c.forEach((t) => {
                t.checked && ((r = !0), l++);
            }),
                r ? ((o.innerHTML = l),
                    t.classList.add("d-none"),
                    e.classList.remove("d-none"))
                    : (t.classList.remove("d-none"), e.classList.add("d-none"));
        };
        return {
            init: function () {
                // Modals
                (modal = new bootstrap.Modal(document.querySelector("#kt_modal_add_user"))),
                (modal_permission = new bootstrap.Modal(document.querySelector("#kt_modal_permission"))),
                // inicialize elements html
                (btn_add_permission = document.querySelector("#btn_add_permission")),
                (select_permission = document.querySelector("#select_permission")),
                (form = document.querySelector("#kt_modal_add_user_form")),
                (btn_modal = form.querySelector("#kt_modal_add_user_close")),
                (btn_submit = form.querySelector("#kt_modal_add_user_submit")),
                (btn_cancel = form.querySelector("#kt_modal_add_user_cancel")),
                (edit_name = form.querySelector("#name")),
                (edit_last_name = form.querySelector("#last_name")),
                (edit_user_name = form.querySelector("#user_name")),
                (edit_address = form.querySelector("#address")),
                (edit_phone = form.querySelector("#phone")),
                (edit_id = form.querySelector("#id_user")),
                (validations = FormValidation.formValidation(form, {
                    fields: {
                        name: {
                            validators: {
                                notEmpty: {
                                    message: "Nombre requerido",
                                },
                            },
                        },
                        last_name: {
                            validators: {
                                notEmpty: {
                                    message: "Apellido requerido",
                                },
                            },
                        },
                        user_name: {
                            validators: {
                                notEmpty: {
                                    message: "Nombre de Usuario requerido",
                                },
                            },
                        },
                    },
                    plugins: {
                        trigger: new FormValidation.plugins.Trigger(),
                        bootstrap: new FormValidation.plugins.Bootstrap5({
                            rowSelector: ".fv-row",
                            eleInvalidClass: "",
                            eleValidClass: "",
                        }),
                    },
                })),
                (n = document.querySelector("#kt_users_table")) &&
                (n.querySelectorAll("tbody tr").forEach((t) => {
                    // formats
                    }),
                    (table_items = $(n).DataTable({
                        ajax: "users",
                        processing: true,
                        columns: [
                            { data: "check", name: "check" },
                            { data: "id", name: "id" },
                            { data: "username", name: "user_name" },
                            { data: "name", name: "name" },
                            { data: "phone", name: "phone" },
                            { data: "address", name: "address" },
                            { data: "buttons", name: "buttons" },
                        ],
                        order: [[2, "asc"]],
                        columnDefs: [
                            { orderable: !1, targets: 0 },
                            {
                                targets: [1],
                                visible: false,
                                searchable: false,
                            },
                        ],
                        language: {
                            zeroRecords: "<div class='container-fluid '> <div class='d-flex flex-center'>" +
                            "<span>No hay datos que mostrar</span></div></div>",
                            info: "Mostrando página _PAGE_ de _PAGES_",
                            infoEmpty: "No hay información",
                            infoFiltered: "(Filtrando _MAX_ registros)",
                            processing:
                                "<span class='fa-stack fa-lg'>\n\
                                <i class='fa fa-spinner fa-spin fa-stack-2x fa-fw'></i>\n\
                            </span>&emsp;Processing Message here...",
                        },
                    })).on("draw", function () {
                        delete_items(), edit(), uncheck();
                    }),
                    delete_items(),
                    edit(),
                    // permissions(),
                    document.querySelector('[data-kt-user-table-filter="search"]').addEventListener("keyup", function (e) {
                        table_items.search(e.target.value).draw();
                    })
                );
                // TABLE PERMISSIONS
                (table_permissions = $("#kt_users_permissions_table").DataTable({
                    order: [[1, "asc"]],
                    columnDefs: [
                        { orderable: !1, targets: 0 },
                    ],
                    language: {
                        zeroRecords: "<div class='container-fluid '> <div class='d-flex flex-center'>" +
                        "<span>No hay datos que mostrar</span></div></div>",
                        info: "Mostrando página _PAGE_ de _PAGES_",
                        infoEmpty: "<div class='container-fluid'>No hay Información</div>",
                        infoFiltered: "(Filtrando _MAX_ registros)",
                        processing:
                            "<span class='fa-stack fa-lg'>\n\
                            <i class='fa fa-spinner fa-spin fa-stack-2x fa-fw'></i>\n\
                        </span>&emsp;Processing Message here...",
                    },
                }).on("draw", function(){
                    delete_permission();
                }));
                // CLOSE MODAL
                btn_modal.addEventListener("click", function (t) {
                    t.preventDefault(), modal.hide();
                });
                // CLOSE MODAL
                btn_cancel.addEventListener("click", function (t) {
                    t.preventDefault(), modal.hide();
                });
                // ADD PERMISSION TO DATATABLE
                btn_add_permission.addEventListener("click", function (t) {
                    t.preventDefault();
                    if(select_permission.value != ""){
                        table_permissions.row.add([select_permission.value, `<button type="button" class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm me-1" data-kt-customer-table-filter="delete_row">
                        <span class="svg-icon svg-icon-muted svg-icon-5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black"/>
                            <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black"/>
                            <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black"/>
                            </svg></span>
                    </button>`]).draw();
                    }

                });
                // SUBMIT
                btn_submit.addEventListener("click", function (e) {
                    e.preventDefault(),
                    validations &&
                    validations.validate().then(function (e) {
                        "Valid" == e
                            ? (btn_submit.setAttribute(
                                    "data-kt-indicator",
                                    "on"
                                ),
                                (btn_submit.disabled = !0),
                                setTimeout(function () {
                                    btn_submit.removeAttribute(
                                        "data-kt-indicator"
                                    ),

                                    $.ajax({
                                        url: "users",
                                        type: "POST",
                                        // dataType:"json",
                                        // encode: "true",
                                        headers: {
                                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                        },
                                        data: $("#kt_modal_add_user_form").serialize(),
                                        success: function (result) {
                                                Swal.fire({
                                                text: "Datos guardados exitosamente!",
                                                icon: "success",
                                                buttonsStyling: !1,
                                                confirmButtonText:
                                                    "Entendido!",
                                                customClass: {
                                                confirmButton:
                                                    "btn btn-primary",
                                            },
                                            }).then(function (e) {
                                                e.isConfirmed &&
                                                    (modal.hide(),
                                                    (btn_submit.disabled =
                                                        !1), table_items.ajax.reload(), form.reset());
                                            });
                                        },
                                        beforeSend(){
                                            Swal.fire({
                                                title: "<strong>Cargando</strong>",
                                                html: `<div class="progress container-fluid"></div>`,
                                                showConfirmButton: false,
                                                });
                                        },
                                        error(data){
                                            Swal.fire({
                                                icon: "error",
                                                title: "Error",
                                                text: "Ocurrio un error en la base de datos!",
                                            });
                                                console.log(data);
                                        }
                                    });

                                }, 1000))
                            : Swal.fire({
                                    text: "Error, faltan algunos datos, intente de nuevo por favor.",
                                    icon: "error",
                                    buttonsStyling: !1,
                                    confirmButtonText: "Entendido!",
                                    customClass: {
                                        confirmButton: "btn btn-primary",
                                    },
                                });
                    });
                });
            },
        };
})();
KTUtil.onDOMContentLoaded(function () {
    KTUsersList.init();
});
