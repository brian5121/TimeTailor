from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import logging
import os
import requests  # 添加此行导入 requests 模块

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'
db = SQLAlchemy(app)

# 设置日志级别
app.logger.setLevel(logging.DEBUG)

class Summary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)

@app.before_first_request
def create_tables():
    db.create_all()
    app.logger.debug("Database file is located at: %s", os.path.abspath("events.db"))


import requests

# 在函数外部定义变量来缓存日程信息
cached_schedule = None

@app.route('/receive_data', methods=['POST'])
def receive_data():
    try:
        global cached_schedule  # 使用全局变量
        data = request.json
        new_summary = Summary(content=data['summary'])
        db.session.add(new_summary)
        db.session.commit()
        app.logger.debug("Received data: %s", data)
        app.logger.debug("New entry added with ID: %s", new_summary.id)
        
        # 更新缓存的日程信息
        summaries = Summary.query.all()
        texts = [summary.content for summary in summaries]
        combined_text = "Here are the schedule that i updated in the time sequence, give me what will I do in the JSON form of [start time, end time, title].If I have more than I task, then give me all the tasks in seperate JSON form. If I have one task for multiple times, give me the JSON form of the latest one. Note that if the text contains pharse 'broken leg' or similar sickness, then empty the data base"
        combined_text += " ".join(texts)

        # 调用 OpenAI API 获取日程安排
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '
            },
            json={
                'model': 'gpt-3.5-turbo',
                'messages': [{'role': 'user', 'content': combined_text}]
            }
        )
        data = response.json()
        schedule = data['choices'][0]['message']['content']

        # 更新缓存的日程安排
        cached_schedule = schedule

        return jsonify({"message": "Data saved successfully"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        app.logger.error("Database error: %s", str(e))
        return jsonify({"message": "Database error"}), 500

@app.route('/generate_schedule', methods=['GET'])
def generate_schedule():
    global cached_schedule  # 使用全局变量
    # 如果有缓存的日程信息，则直接返回缓存的结果
    if cached_schedule:
        return jsonify({"schedule": cached_schedule})
    
    # 否则返回错误消息
    return jsonify({"error": "No schedule available"}), 404


# @app.route('/receive_data', methods=['POST'])
# def receive_data():
#     try:
#         data = request.json
#         new_summary = Summary(content=data['summary'])
#         db.session.add(new_summary)
#         db.session.commit()
#         app.logger.debug("Received data: %s", data)
#         app.logger.debug("New entry added with ID: %s", new_summary.id)
#         return jsonify({"message": "Data saved successfully"}), 200
#     except SQLAlchemyError as e:
#         db.session.rollback()
#         app.logger.error("Database error: %s", str(e))
#         return jsonify({"message": "Database error"}), 500

# import requests

# # 在函数外部定义变量来缓存日程信息
# cached_schedule = None

# @app.route('/generate_schedule', methods=['GET'])
# def generate_schedule():
#     global cached_schedule  # 声明要使用的全局变量
#     # 如果已经有缓存的日程信息，则直接返回缓存的结果
#     if cached_schedule:
#         return jsonify({"schedule": cached_schedule})

#     # 否则，从数据库中获取摘要内容，并生成用于调用 OpenAI API 的文本
#     summaries = Summary.query.all()
#     texts = [summary.content for summary in summaries]
#     combined_text = "Here are the schedule that i updated in the time sequence, give me what will I do in the JSON form of [start time, end time, title(ensure the class name contains the class number e.g. cs 231n)].If I have more than I task, then give me all the tasks in seperate JSON form. If I have one task for multiple times, give me the JSON form of the latest one"
#     combined_text += " ".join(texts)

#     # 调用 OpenAI API 获取日程安排
#     response = requests.post(
#         'https://api.openai.com/v1/chat/completions',
#         headers={
#             'Content-Type': 'application/json',
#             'Authorization': 'Bearer m'
#         },
#         json={
#             'model': 'gpt-3.5-turbo',
#             'messages': [{'role': 'user', 'content': combined_text}]
#         }
#     )
#     data = response.json()
#     schedule = data['choices'][0]['message']['content']

#     # 将结果缓存起来
#     cached_schedule = schedule

#     return jsonify({"schedule": schedule})


if __name__ == '__main__':
    # db.create_all()
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
