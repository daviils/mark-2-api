FASE - 1
WEB
 - HOME (searchTopics,reportTopic,createTopic)
 - TOPIC (topicById, addComments,reportComments)

ROTAS
 topicById(id){topic}
 searchTopic(keyword,categories,status){topic}
 reportTopic(id){defaultMessage}
 addTopic(topic){defaultMessage}
 reportComments(id){defaultMessage}
 addComment(comments){defaulMessage}

 BANCO
 TOPIC(title,description,link,categoryId)
 COMMENTS(title,description,link,topicId)
 COMMENTS_REPLY(title,description,link,commentId)

FASE - 2
ADMIM
 - LOGIN (loginAdmin)
 - TOPICS (searchTopicsAdmin, deleteTopicAdmin)
 - TOPIC_DETAIL (topicById)


 loginAdmin(email,senha){token,user}
 searchTopicAdmin(keyword,categories,status){topic}
 deleteTopicAdmin(id){defaultMessage}
 deleteCommentAdmin(id){defaultMessage}

 CATEGORY(name) - politica, musica, cinema, video game, outros
