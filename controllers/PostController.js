import PostModel from '../models/post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate("user").exec();
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при получении постов',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after'} // Добавил populate для user
        ).exec();

        if (!doc) {
            return res.status(404).json({
                message: 'Пост не найден',
            });
        }

        res.json(doc);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при получении поста',
        });
    }
};

export const create = async (req, res) => {
    try {
        const { title, text, imageUrl, tags } = req.body;

        const doc = new PostModel({
            title,
            text,
            imageUrl,
            tags,
            user: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Ошибка при создании поста',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete({ _id: postId });

        if (!doc) {
            return res.status(404).json({
                message: "Пост не найден",
            });
        }

        res.json({
            message: "Пост успешно удален",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Ошибка при удалении поста",
        });
    }
};

export const update = async (req, res) => {
    try{
        const postId = req.params.id;

        await PostModel.findOneAndUpdate({ _id: postId, }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        res.json({
            message: "Пост успешно изменен ",
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            message: "Ошибка при изменении поста"
        })
    }
}
