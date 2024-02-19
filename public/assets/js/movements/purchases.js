"use strict";
var KTUsersList = (function () {
    /*Variables*/
    const delete_product = function (e) {
        e.preventDefault();
        let total_arr = total_text.innerText;
        let var2 = total_arr.split("$");
        total = parseFloat(var2[1].replace(/,/g, ''));
        const o = e.target.closest("tr");
        n = o.querySelectorAll("td")[3].innerText;
        total=total-n;
        total_text.innerText="$"+total;
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": true,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };
        table_products.row($(o)).remove().draw();
        toastr.error("Producto eliminado!");
    };
    var table_products,
        btn_add_product,
        btn_save,
        select_products,
        date_now,
        date,
        total_text,
        total,
        n,
        delete_permission = () => {
            document.querySelectorAll('[data-kt-customer-table-filter="delete_row"]').forEach((button) => {
                button.removeEventListener("click", delete_product);
                button.addEventListener("click", delete_product);
            });
        },
        init_dialers = () => {
            $('.input-group[data-kt-dialer="true"]').each(function () {
                var dialerElement = this;
                var dialerObject = new KTDialer(dialerElement, {
                    min: 1,
                    max: 50,
                    step: 1,
                });
            });
        },
        change_quantity = () => {
            var datosColumna = table_products.column(4).data();
            console.log(datosColumna)
            var arrayColumna = datosColumna.toArray();
            var suma = arrayColumna.reduce(function(a, b) {
                return a + parseFloat(b);
            }, 0)
            total_text.innerText="$"+suma;

        }
        return {
            init: function () {
                (btn_add_product = document.querySelector("#kt_modal_add_product")),
                (btn_save = document.querySelector("#btn_save")),
                (select_products = document.querySelector("#products")),
                (total_text = document.querySelector("#total")),
                (date_now = document.querySelector("#date_now")),
                date = new Date();
                date= date.getFullYear() + "-"+ (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) +"-"+ (date.getDate() < 10 ? '0' + (date.getDate()) : (date.getDate()));
                date_now.textContent = date;
                // TABLE PRODUCTS
                (table_products = $("#kt_products_table").DataTable({
                    paging:!1,
                    info:!1,
                    columnDefs: [
                        {
                            targets: [0],
                            visible: false,
                        },
                        {
                            targets: 3,
                            render: function(data, type, row) {
                                return `<input type="number" class="form-control product-quantity" value="${data}" />`;
                            }
                        },
                        {
                            targets: 4, // Índice de la columna "Total"
                            render: function (data, type, row) {
                                var cantidad = parseFloat(row[3]);
                                var precio = parseFloat(row[2]);
                                var total = cantidad * precio;
                                return total.toFixed(2);
                            }
                        }
                    ],
                }).on("draw", function(){
                    delete_permission();
                }));
                btn_add_product.addEventListener("click", function (t) {
                    t.preventDefault();
                    let arr_product= select_products.value.split("_");
                    if (select_products.value !=""){
                        var data = table_products.rows().data(); // All data datatable permissions
                        let repeat=false;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i][0] == arr_product[0]) {

                                repeat=true;
                            }
                        }
                        if(repeat){
                            Swal.fire({
                                title: "Advertencia!",
                                text: "El producto " + select_products.options[select_products.selectedIndex].text +" ya esta en la lista. aumenta la cantidad!",
                                icon: "warning"
                              });
                        }else{
                            table_products.row.add([arr_product[0], select_products.options[select_products.selectedIndex].text, arr_product[1], 1, arr_product[1], `<a href="#" class="btn btn-icon btn-flex btn-active-light-danger w-30px h-30px me-3" data-kt-customer-table-filter="delete_row">
                            <span class="svg-icon svg-icon-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M5 9C5 8.44772 5.44772 8 6 8H18C18.5523 8 19 8.44772 19 9V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V9Z" fill="black" />
                                    <path opacity="0.5" d="M5 5C5 4.44772 5.44772 4 6 4H18C18.5523 4 19 4.44772 19 5V5C19 5.55228 18.5523 6 18 6H6C5.44772 6 5 5.55228 5 5V5Z" fill="black" />
                                    <path opacity="0.5" d="M9 4C9 3.44772 9.44772 3 10 3H14C14.5523 3 15 3.44772 15 4V4H9V4Z" fill="black" />
                                </svg>
                            </span>
                            </a>`]).draw();
                            init_dialers();
                            // CHANGE TOTAL OF PURCHASE
                            // let total_arr=total_text.innerText;
                            let total_arr= total_text.innerText.split("$");
                            total=parseFloat(total_arr[1].replace(/,/g, ''));
                            let suma=total+parseFloat(arr_product[1]);
                            total_text.innerText="$"+suma;

                        }
                    }
                    else{
                        Swal.fire({
                            title: "Advertencia!",
                            text: "Seleccione un producto!",
                            icon: "warning"
                            });
                    }
                });
                table_products.on('change', '.product-quantity', function() {
                    var tr = $(this).closest('tr');
                    var rowIndex = table_products.row(tr).index();
                    var cantidad = parseFloat($(this).val());
                    table_products.cell(rowIndex, 3).data(cantidad);
                    var precio = parseFloat(table_products.cell(rowIndex, 2).data());
                    var total_table = cantidad * precio;
                    table_products.cell(rowIndex, 4).data(total_table);
                    // CHANGE TOTAL OF PURCHASE
                    // let total_arr=total_text.innerText;
                    // let total_arr= total_text.innerText.split("$");
                    // total=parseFloat(total_arr[1].replace(/,/g, ''));
                    // let suma=total+parseFloat(total_table);
                    // total_text.innerText="$"+suma;
                    change_quantity()
                });
                btn_save.addEventListener("click", function (t) {
                    t.preventDefault();
                    var data_products = table_products.data().toArray();
                    let total_a=total_text.innerText;
                    let total_t=total_a.split("$");
                    let sub=total_t[1]
                    // Realizar la petición AJAX
                    $.ajax({
                        url: 'save_purchase',
                        type: 'POST',
                        data: {
                            products:JSON.stringify(data_products),
                            date:date,
                            total:sub
                        },
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        success: function(response) {
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
                                    location.reload()
                            });
                        },
                        beforeSend(){
                            Swal.fire({
                                title: "<strong>Cargando</strong>",
                                html: `<div class="progress container-fluid"></div>`,
                                showConfirmButton: false,
                                allowOutsideClick: true
                            });
                        },
                        error: function(error) {
                            console.error('Error al guardar datos:', error);
                        }
                    });
                });
            },
        };
})();
KTUtil.onDOMContentLoaded(function () {
    KTUsersList.init();
});


