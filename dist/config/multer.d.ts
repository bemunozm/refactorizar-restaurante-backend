import multer from 'multer';
declare global {
    namespace Express {
        interface Request {
            file?: Express.Multer.File;
            files?: {
                [fieldname: string]: Express.Multer.File[];
            } | Express.Multer.File[];
        }
    }
}
declare const upload: multer.Multer;
export default upload;
