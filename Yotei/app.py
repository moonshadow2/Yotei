from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os

app = Flask(__name__)
CORS(app)

# --- DB Connection ---
MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://mbonann2:Yotei_@yoteistorage.mlase5y.mongodb.net/?appName=YoteiStorage")
client = MongoClient(MONGO_URI)
db = client["taskapp"]
tasks_col = db["tasks"]

# --- Helper: convert MongoDB doc to JSON-safe dict ---
def serialize(task):
    task["_id"] = str(task["_id"])  # ObjectId → string
    return task

# --- GET all tasks ---
@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = list(tasks_col.find())
    return jsonify([serialize(t) for t in tasks])

# --- POST a new task ---
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    task = {
        "id":        data.get("id"),         # keep your crypto.randomUUID() id
        "title":     data.get("title", ""),
        "details":   data.get("details", ""),
        "priority":  data.get("priority", "low"),
        "dueDate":   data.get("dueDate"),
        "dueTime":   data.get("dueTime"),
        "completed": data.get("completed", False),
        "createdAt": data.get("createdAt"),
    }
    result = tasks_col.insert_one(task)
    task["_id"] = str(result.inserted_id)
    return jsonify(task), 201

# --- PUT (update) a task by your UUID id ---
@app.route("/tasks/<task_id>", methods=["PUT"])
def update_task(task_id):
    changes = request.get_json()
    changes.pop("_id", None)  # don't try to overwrite MongoDB's _id
    tasks_col.update_one({"id": task_id}, {"$set": changes})
    updated = tasks_col.find_one({"id": task_id})
    return jsonify(serialize(updated))

# --- DELETE a task by your UUID id ---
@app.route("/tasks/<task_id>", methods=["DELETE"])
def delete_task(task_id):
    tasks_col.delete_one({"id": task_id})
    return jsonify({"status": "deleted", "id": task_id})

if __name__ == "__main__":
    app.run(debug=True, port=5000)