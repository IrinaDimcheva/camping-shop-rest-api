const { userModel, postModel, commentModel } = require('../models');

function getLatestsComments(req, res, next) {
	const limit = Number(req.query.limit) || 0;

	commentModel.find()
		.sort({ created_at: -1 })
		.limit(limit)
		.populate('postId userId')
		.then(comments => {
			res.status(200).json(comments)
		})
		.catch(next);
}

function getComments(req, res, next) {
	const { postId } = req.params;

	commentModel.find({ postId: postId })
		.populate({
			path: 'userId',
			select: ['username']
		})
		.then(comments => {
			res.status(200).json(comments);
		});
}

function getComment(req, res, next) {
	const { postId, commentId } = req.params;

	commentModel.findById(commentId)
		.then(comment => res.json(comment))
		.catch(next);
}

function createComment(req, res, next) {
	const { postId } = req.params;
	const { text } = req.body;
	const { _id: userId } = req.user;

	commentModel.create({ text, userId, postId })
		.then(comment => {
			return Promise.all([
				userModel.updateOne({ _id: userId }, { $push: { comments: comment._id }, $addToSet: { posts: postId } }),
				postModel.findByIdAndUpdate({ _id: postId }, { $push: { comments: comment._id } }, { new: true })
			])
		})
		.then(([_, updatedPost]) => res.status(200).json(updatedPost))
		.catch(next);
}

function editComment(req, res, next) {
	const { commentId } = req.params;
	const { commentText } = req.body;
	const { _id: userId } = req.user;

	// if the userId is not the same as this one of the comment, the comment will not be updated
	commentModel.findByIdAndUpdate(commentId, req.body)
		.then(updatedComment => {
			if (updatedComment) {
				res.status(200).json(updatedComment);
			}
			else {
				res.status(401).json({ message: `Not allowed!` });
			}
		})
		.catch(next);
}

function deleteComment(req, res, next) {
	const { commentId, postId } = req.params;
	const { _id: userId } = req.user;

	Promise.all([
		commentModel.findOneAndDelete({ _id: commentId, userId }),
		userModel.findOneAndUpdate({ _id: userId }, { $pull: { comments: commentId } }),
		postModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: commentId } }),
	])
		.then(([deletedOne, _, __]) => {
			if (deletedOne) {
				res.status(200).json(deletedOne)
			} else {
				res.status(401).json({ message: `Not allowed!` });
			}
		})
		.catch(next);
}

function like(req, res, next) {
	const { commentId } = req.params;
	const { _id: userId } = req.user;

	commentModel.updateOne({ _id: commentId }, { $addToSet: { likes: userId } }, { new: true })
		.then(() => res.status(200).json({ message: 'Liked successful!' }))
		.catch(next)
}

module.exports = {
	getLatestsComments,
	getComments,
	getComment,
	createComment,
	editComment,
	deleteComment,
	like,
}
