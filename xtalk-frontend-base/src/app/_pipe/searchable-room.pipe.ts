import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'searchableRoom',
})
export class SearchableRoomPipe implements PipeTransform {
    transform(value: any, input: any, searchableRoom: any) {
        if (input) {
            input = input.toLowerCase();
            return value.filter(function (el: any) {
                var isTrue = false;
                for (var k in searchableRoom) {
                    // return el;
                    if(el.userId[searchableRoom[k]]){

                    if (el.userId[searchableRoom[k]].toLowerCase().indexOf(input) > -1 ) {
                        isTrue = true;
                    }
                    if (isTrue) {
                        return el
                    }
                    }
                    if(el.modelId[searchableRoom[k]]){
                        if (el.modelId[searchableRoom[k]].toLowerCase().indexOf(input) > -1 ) {
                            isTrue = true;
                        }
                        if (isTrue) {
                            return el
                        }   
                    }
                }
            })
        }
        return value;
    }
}