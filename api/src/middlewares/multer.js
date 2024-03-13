import multer from "multer";
import path from "path";
import fs from "fs";

let newDirectory = "";

// multer.diskStorage permet de définir le dossier de destination et le nom du fichier
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // le nom du dossier est le titre de l'article suffixé par id_ pour éviter les doublons
        // de fait chaque article aura son propre dossier d'images
        if (req.body.type === 'avatar') {
            newDirectory = path.join(
                process.cwd(),
                `public/assets/img/avatar/${req.user.id}_${req.user.username}`  
            );
        } else {
            newDirectory = path.join(
                process.cwd(),
                "public/assets/img/post/" + req.body.postId
            );
        }
        fs.mkdirSync(newDirectory, { recursive: true });
        cb(null, newDirectory);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // ajoute un timestamp au nom du fichier pour éviter les doublons + conserve l'extension du fichier
    },
});

// la fonction multer permet de définir la taille maximale des fichiers, les extensions acceptées et le nombre de fichiers acceptés
const upload = (req, res, next) => {
    multer({
        storage: storage,
        limits: {
            fileSize: 5 * 1024 * 1024, // limiter la taille du fichier à 5MB
        },
        fileFilter: function (req, file, cb) {
            const filetypes = /png|jpg|jpeg/; // extension de fichiers acceptées
            // test permet de vérifier si l'extension du fichier correspond à l'expression régulière
            const isExtnameValid = filetypes.test(
                path.extname(file.originalname).toLowerCase()
            );

            // test permet de vérifier si le type MIME du fichier correspond à l'expression régulière
            const isMimetypeValid = filetypes.test(file.mimetype);

            if (isMimetypeValid && isExtnameValid) {
                // si l'extension et le mimetype sont valides
                // on accepte le fichier
                // null correspond à l'erreur, true correspond à l'acceptation du fichier
                return cb(null, true);
            } else {
                cb("Images en png, jpg ou jpeg uniquement");
            }
        },
    }).array("image", 5) // image est le nom de l'input type file -> attribut name, 10 est le nombre de fichiers acceptés maximum
    (req, res, function(err) {
        if (err) {
            // handle error
            return res.status(500).json({ error: err.message });
        }
        req.files = req.files.map(file => {
            return file.path.split("public")[1].split("\\").join("/");
        });
    next();
    });
}

export default upload;