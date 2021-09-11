export interface IGallery {
    title: string;
    fileUrlBase: string;
    createAt:Date;
    updateAt:Date;
    _id:string;
    deserialize(input: any): this;
  }
  