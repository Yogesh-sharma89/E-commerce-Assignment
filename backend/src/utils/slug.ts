import slugify from "slugify";

export const GenerateSlug = (title:string)=>{

    const slug = slugify(title,{
        strict:true,
        lower:true,
        trim:true
    })

    return slug;
}