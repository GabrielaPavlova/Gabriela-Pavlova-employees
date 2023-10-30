var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
System.register("app/app.component", ["@angular/core", "papaparse", "date-fns"], function (exports_1, context_1) {
    "use strict";
    var core_1, Papa, date_fns_1, AppComponent;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Papa_1) {
                Papa = Papa_1;
            },
            function (date_fns_1_1) {
                date_fns_1 = date_fns_1_1;
            }
        ],
        execute: function () {
            exports_1("AppComponent", AppComponent = (() => {
                let _classDecorators = [core_1.Component({
                        selector: 'app-root',
                        templateUrl: './app.component.html',
                        styleUrls: ['./app.component.css'],
                    })];
                let _classDescriptor;
                let _classExtraInitializers = [];
                let _classThis;
                var AppComponent = _classThis = class {
                    constructor() {
                        this.start = new Date(date_fns_1.startOfDay(new Date()));
                    }
                    onFileSelected(file) {
                        this.uploadedFile = file;
                        this.processFile();
                    }
                    processFile() {
                        if (this.uploadedFile) {
                            Papa.parse(this.uploadedFile, {
                                complete: (result) => {
                                    const csvData = result.data;
                                    this.resultData = this.checkLongestWorkPeriod(csvData);
                                },
                                header: true,
                            });
                        }
                    }
                    checkLongestWorkPeriod(employeesData) {
                        const parseDate = (date) => {
                            if (date instanceof Date) {
                                return date;
                            }
                            else if (typeof date === 'string') {
                                const parsedDate = date_fns_1.parse(date, 'yyyy-MM-dd', new Date());
                                return date_fns_1.isValid(parsedDate) ? parsedDate : null;
                            }
                            else {
                                return null;
                            }
                        };
                        const formatDate = (date) => (date ? date : new Date());
                        const employeeGroups = {};
                        employeesData.forEach((entry) => {
                            const empID = entry.EmpID;
                            if (!employeeGroups[empID]) {
                                employeeGroups[empID] = [];
                            }
                            employeeGroups[empID].push({
                                ProjectID: entry.ProjectID,
                                DateFrom: new Date(entry.DateFrom),
                                DateTo: entry.DateTo ? new Date(entry.DateTo) : new Date(),
                            });
                        });
                        let longestWorkPeriod = 0;
                        let longestWorkPair = [0, 0];
                        const employeeIDs = Object.keys(employeeGroups);
                        for (let i = 0; i < employeeIDs.length; i++) {
                            for (let j = i + 1; j < employeeIDs.length; j++) {
                                const empID1 = parseInt(employeeIDs[i], 10);
                                const empID2 = parseInt(employeeIDs[j], 10);
                                const projects1 = employeeGroups[empID1];
                                const projects2 = employeeGroups[empID2];
                                // Find common projects between the two employees.
                                const commonProjects = projects1.filter((project1) => {
                                    return projects2.some((project2) => {
                                        return project1.ProjectID === project2.ProjectID;
                                    });
                                });
                                // Calculate the total work duration for common projects.
                                let totalWorkDuration = 0;
                                commonProjects.forEach((project) => {
                                    const startDate = parseDate(project.DateFrom);
                                    const endDate = parseDate(project.DateTo);
                                    totalWorkDuration += this.calculateWorkDuration(formatDate(startDate), formatDate(endDate));
                                });
                                if (totalWorkDuration > longestWorkPeriod) {
                                    longestWorkPeriod = totalWorkDuration;
                                    longestWorkPair = [empID1, empID2];
                                }
                            }
                        }
                        const dataProjects = [
                            {
                                employee1: longestWorkPair[0],
                                employee2: longestWorkPair[1],
                                daysWorked: longestWorkPeriod,
                            },
                        ];
                        return dataProjects;
                    }
                    calculateWorkDuration(startDate, endDate) {
                        // Calculate the duration in months for a project.
                        const diffInMilliseconds = endDate.getTime() - startDate.getTime();
                        // Approximate average days in a month.
                        const diffInMonths = diffInMilliseconds / (1000 * 60 * 60 * 24 * 30.44);
                        return Math.floor(diffInMonths);
                    }
                };
                __setFunctionName(_classThis, "AppComponent");
                (() => {
                    __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name }, null, _classExtraInitializers);
                    AppComponent = _classThis = _classDescriptor.value;
                    __runInitializers(_classThis, _classExtraInitializers);
                })();
                return AppComponent = _classThis;
            })());
        }
    };
});
System.register("app/file-upload/file-upload.component", ["@angular/core"], function (exports_2, context_2) {
    "use strict";
    var core_2, FileUploadComponent;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (core_2_1) {
                core_2 = core_2_1;
            }
        ],
        execute: function () {
            exports_2("FileUploadComponent", FileUploadComponent = (() => {
                let _classDecorators_1 = [core_2.Component({
                        selector: 'app-file-upload',
                        templateUrl: './file-upload.component.html',
                        styleUrls: ['./file-upload.component.css'],
                    })];
                let _classDescriptor_1;
                let _classExtraInitializers_1 = [];
                let _classThis_1;
                let _instanceExtraInitializers = [];
                let _fileSelected_decorators;
                let _fileSelected_initializers = [];
                var FileUploadComponent = _classThis_1 = class {
                    constructor() {
                        this.fileSelected = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _fileSelected_initializers, new core_2.EventEmitter()));
                    }
                    onFileSelected(event) {
                        const file = event.target.files[0];
                        this.fileSelected.emit(file);
                    }
                };
                __setFunctionName(_classThis_1, "FileUploadComponent");
                (() => {
                    _fileSelected_decorators = [core_2.Output()];
                    __esDecorate(null, null, _fileSelected_decorators, { kind: "field", name: "fileSelected", static: false, private: false, access: { has: obj => "fileSelected" in obj, get: obj => obj.fileSelected, set: (obj, value) => { obj.fileSelected = value; } } }, _fileSelected_initializers, _instanceExtraInitializers);
                    __esDecorate(null, _classDescriptor_1 = { value: _classThis_1 }, _classDecorators_1, { kind: "class", name: _classThis_1.name }, null, _classExtraInitializers_1);
                    FileUploadComponent = _classThis_1 = _classDescriptor_1.value;
                    __runInitializers(_classThis_1, _classExtraInitializers_1);
                })();
                return FileUploadComponent = _classThis_1;
            })());
        }
    };
});
System.register("app/result-grid/result-grid.component", ["@angular/core"], function (exports_3, context_3) {
    "use strict";
    var core_3, ResultGridComponent;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (core_3_1) {
                core_3 = core_3_1;
            }
        ],
        execute: function () {
            exports_3("ResultGridComponent", ResultGridComponent = (() => {
                let _classDecorators_2 = [core_3.Component({
                        selector: 'app-result-grid',
                        templateUrl: './result-grid.component.html',
                        styleUrls: ['./result-grid.component.css'],
                    })];
                let _classDescriptor_2;
                let _classExtraInitializers_2 = [];
                let _classThis_2;
                let _instanceExtraInitializers_1 = [];
                let _data_decorators;
                let _data_initializers = [];
                var ResultGridComponent = _classThis_2 = class {
                    constructor() {
                        this.data = (__runInitializers(this, _instanceExtraInitializers_1), __runInitializers(this, _data_initializers, []));
                        this.displayedColumns = ['employee1', 'employee2', 'daysWorked'];
                    }
                };
                __setFunctionName(_classThis_2, "ResultGridComponent");
                (() => {
                    _data_decorators = [core_3.Input()];
                    __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: obj => "data" in obj, get: obj => obj.data, set: (obj, value) => { obj.data = value; } } }, _data_initializers, _instanceExtraInitializers_1);
                    __esDecorate(null, _classDescriptor_2 = { value: _classThis_2 }, _classDecorators_2, { kind: "class", name: _classThis_2.name }, null, _classExtraInitializers_2);
                    ResultGridComponent = _classThis_2 = _classDescriptor_2.value;
                    __runInitializers(_classThis_2, _classExtraInitializers_2);
                })();
                return ResultGridComponent = _classThis_2;
            })());
        }
    };
});
System.register("app/app.module", ["@angular/core", "@angular/platform-browser", "app/app.component", "@angular/forms", "@angular/common/http", "app/file-upload/file-upload.component", "app/result-grid/result-grid.component", "@angular/material/table"], function (exports_4, context_4) {
    "use strict";
    var core_4, platform_browser_1, app_component_1, forms_1, http_1, file_upload_component_1, result_grid_component_1, table_1, AppModule;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (platform_browser_1_1) {
                platform_browser_1 = platform_browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (file_upload_component_1_1) {
                file_upload_component_1 = file_upload_component_1_1;
            },
            function (result_grid_component_1_1) {
                result_grid_component_1 = result_grid_component_1_1;
            },
            function (table_1_1) {
                table_1 = table_1_1;
            }
        ],
        execute: function () {
            exports_4("AppModule", AppModule = (() => {
                let _classDecorators_3 = [core_4.NgModule({
                        declarations: [
                            app_component_1.AppComponent,
                            file_upload_component_1.FileUploadComponent,
                            result_grid_component_1.ResultGridComponent,
                        ],
                        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpClientModule, table_1.MatTableModule],
                        providers: [],
                        bootstrap: [app_component_1.AppComponent],
                    })];
                let _classDescriptor_3;
                let _classExtraInitializers_3 = [];
                let _classThis_3;
                var AppModule = _classThis_3 = class {
                };
                __setFunctionName(_classThis_3, "AppModule");
                (() => {
                    __esDecorate(null, _classDescriptor_3 = { value: _classThis_3 }, _classDecorators_3, { kind: "class", name: _classThis_3.name }, null, _classExtraInitializers_3);
                    AppModule = _classThis_3 = _classDescriptor_3.value;
                    __runInitializers(_classThis_3, _classExtraInitializers_3);
                })();
                return AppModule = _classThis_3;
            })());
        }
    };
});
System.register("main", ["@angular/platform-browser-dynamic", "app/app.module"], function (exports_5, context_5) {
    "use strict";
    var platform_browser_dynamic_1, app_module_1;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (app_module_1_1) {
                app_module_1 = app_module_1_1;
            }
        ],
        execute: function () {
            platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule)
                .catch(err => console.error(err));
        }
    };
});
