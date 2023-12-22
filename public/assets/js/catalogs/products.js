"use strict";
var KTproductsList = (function () {
    var table_items,
        btn_modal,
        btn_cancel,
        btn_submit,
        modal,
        validations,
        form,
        edit_id,
        edit_name,
        edit_description,
        edit_xtock,
        edit_cost,
        edit_price_a,
        edit_price_b,
        select_category,
        n,
        edit = () => {
            n.querySelectorAll(
                '[data-kt-product-table-filter="edit"]'
            ).forEach((e) => {
                e.addEventListener("click", function (e) {
                    e.preventDefault();
                    $.get("products/"+ $(this).data("id") + "/edit", function(data){
                        edit_id.value=data.product.id;
                        edit_name.value=data.product.name;
                        edit_xtock.value=data.product.xtock;
                        edit_cost.value=data.product.cost;
                        edit_price_a.value=data.product.price_a;
                        edit_price_b.value=data.product.price_b;
                        edit_description.value=data.product.description;
                        select_category.value=data.product.category_id;
                        modal.show();
                    })
                });
            });
        },
        delete_items = () => {
            const e = n.querySelectorAll('[type="checkbox"]'),
                o = document.querySelector(
                    '[data-kt-product-table-select="delete_selected"]'
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
                        url: "destroy_products",
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
                    '[data-kt-product-table-toolbar="base"]'
                ),
                e = document.querySelector(
                    '[data-kt-product-table-toolbar="selected"]'
                ),
                o = document.querySelector(
                    '[data-kt-product-table-select="selected_count"]'
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
                (modal = new bootstrap.Modal(document.querySelector("#kt_modal_add_product"))),
                (select_category = document.querySelector("#category_id")),
                // inicialize elements html
                (form = document.querySelector("#kt_modal_add_product_form")),
                (btn_modal = form.querySelector("#kt_modal_add_product_close")),
                (btn_submit = form.querySelector("#kt_modal_add_product_submit")),
                (btn_cancel = form.querySelector("#kt_modal_add_product_cancel")),
                (edit_id = form.querySelector("#id_product")),
                (edit_name = form.querySelector("#name")),
                (edit_xtock = form.querySelector("#xtock")),
                (edit_cost = form.querySelector("#cost")),
                (edit_price_a = form.querySelector("#price_a")),
                (edit_price_b = form.querySelector("#price_b")),
                (edit_description = form.querySelector("#description")),
                (validations = FormValidation.formValidation(form, {
                    fields: {
                        name: {
                            validators: {
                                notEmpty: {
                                    message: "Nombre requerido",
                                },
                            },
                        },
                        xtock: {
                            validators: {
                                notEmpty: {
                                    message: "Cantidad requerido",
                                },
                            },
                        },
                        cost: {
                            validators: {
                                notEmpty: {
                                    message: "Costo requerido",
                                },
                            },
                        },
                        pricea: {
                            validators: {
                                notEmpty: {
                                    message: "Precio requerido",
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
                (n = document.querySelector("#kt_products_table")) &&
                    (n.querySelectorAll("tbody tr").forEach((t) => {
                        // formats
                        }),
                        (table_items = $(n).DataTable({
                            ajax: "products",
                            processing: true,
                            columns: [
                                { data: "check", name: "check" },
                                { data: "id", name: "id" },
                                { data: "name", name: "name" },
                                { data: "category", name: "category" },
                                { data: "xtock", name: "xtock" },
                                { data: "cost", name: "cost" },
                                { data: "price_a", name: "price_a" },
                                { data: "price_b", name: "price_b" },
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
                                zeroRecords: "No hay datos que mostrar",
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
                        document.querySelector('[data-kt-product-table-filter="search"]').addEventListener("keyup", function (e) {
                            table_items.search(e.target.value).draw();
                        })
                    );
                // CLOSE MODAL
                btn_modal.addEventListener("click", function (t) {
                    t.preventDefault(), modal.hide();
                });
                // CLOSE MODAL
                btn_cancel.addEventListener("click", function (t) {
                    t.preventDefault(), modal.hide();
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
                                        url: "products",
                                        type: "POST",
                                        dataType:"json",
                                        encode: "true",
                                        headers: {
                                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                                        },
                                        data: $("#kt_modal_add_product_form").serialize(),
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
    KTproductsList.init();
});
