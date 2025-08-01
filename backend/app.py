from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

tasks = []
task_counter = 0

def get_next_id():
    global task_counter
    task_counter += 1
    return task_counter

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        return jsonify({
            'success': True,
            'data': tasks,
            'count': len(tasks)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to fetch tasks',
            'message': str(e)
        }), 500

@app.route('/tasks', methods=['POST'])
def add_task():
    try:
        data = request.json
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing task text'
            }), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({
                'success': False,
                'error': 'Task text cannot be empty'
            }), 400
        
        task = {
            'id': get_next_id(),
            'text': text,
            'done': False,
            'created_at': time.time()
        }
        tasks.append(task)
        
        return jsonify({
            'success': True,
            'data': task,
            'message': 'Task added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to add task',
            'message': str(e)
        }), 500

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def mark_done(task_id):
    try:
        task = None
        for t in tasks:
            if t['id'] == task_id:
                task = t
                break
        
        if not task:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404
        
        task['done'] = True
        task['completed_at'] = time.time()
        
        return jsonify({
            'success': True,
            'data': task,
            'message': 'Task marked as completed'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to update task',
            'message': str(e)
        }), 500

@app.route('/tasks/<int:task_id>', methods=['PATCH'])
def edit_task(task_id):
    try:
        data = request.json
        
        if not data or 'text' not in data:
            return jsonify({
                'success': False,
                'error': 'Missing task text'
            }), 400
        
        text = data['text'].strip()
        if not text:
            return jsonify({
                'success': False,
                'error': 'Task text cannot be empty'
            }), 400
        
        task = None
        for t in tasks:
            if t['id'] == task_id:
                task = t
                break
        
        if not task:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404
        
        task['text'] = text
        task['updated_at'] = time.time()
        
        return jsonify({
            'success': True,
            'data': task,
            'message': 'Task updated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to update task',
            'message': str(e)
        }), 500

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        global tasks
        original_count = len(tasks)
        tasks = [task for task in tasks if task['id'] != task_id]
        
        if len(tasks) == original_count:
            return jsonify({
                'success': False,
                'error': 'Task not found'
            }), 404
        
        return jsonify({
            'success': True,
            'message': 'Task deleted successfully'
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': 'Failed to delete task',
            'message': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': time.time(),
        'task_count': len(tasks)
    })

if __name__ == '__main__':
    print("🚀 Starting To-Do List API Server...")
    print("📝 API will be available at: http://127.0.0.1:5000")
    print("🌐 Frontend should connect to: http://127.0.0.1:5000/tasks")
    app.run(debug=True, host='127.0.0.1', port=5000)
