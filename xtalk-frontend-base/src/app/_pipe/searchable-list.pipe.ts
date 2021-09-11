import { Pipe, PipeTransform } from '@angular/core';
import { filter } from 'rxjs/operators';
import {ModelService} from '@/_servies/model.service';
@Pipe({
    name: 'searchableList',
})
export class SearchableListPipe implements PipeTransform {
    constructor(private modelService:ModelService){

    }
    transform(value: any, input: string, searchableList: any) {
        if (input) {
            input = input.toLowerCase();
            let result= value.filter(function (el: any) {
                var isTrue = false;
                switch(searchableList){
                    case "name":
                        if (el['lastName'].toLowerCase().indexOf(input) > -1||el['firstName'].toLowerCase().indexOf(input) > -1) {
                            isTrue = true;
                            return el;
                        }
                        break;
                    case 'age':
                        if (el[searchableList] == input) {
                            isTrue = true;
                            return el;
                        }
                        break;
                    default:
                        if (el[searchableList].toLowerCase().indexOf(input) > -1) {
                            isTrue = true;
                            return el;
                        }
                        return;

                    
                }                
            });
            
            return result;
        }
        return value;
    }
}