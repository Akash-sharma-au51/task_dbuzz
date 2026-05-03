import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Alert,
  Button,
  Form,
  Spinner,
  Badge,
  ListGroup,
  Row,
  Col,
} from 'react-bootstrap';
import { BASE_URL } from '../constants/constant';
import { getToken, getUser, clearSession } from '../services/sessionService';

const statusOptions = ['all', 'pending', 'in progress', 'completed'];

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    setUser(getUser());
    fetchTasks();
  }, [navigate]);

  const authHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    'Content-Type': 'application/json',
  });

  const fetchTasks = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        headers: authHeaders(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to load tasks');
      }

      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes('unauthorized')) {
        clearSession();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (event) => {
    event.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Please provide both a title and description.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to create task');
      }

      setTasks((prev) => [data.task, ...prev]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStartEdit = (task) => {
    setEditingTask({ ...task });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setError('');
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingTask) return;

    if (!editingTask.title.trim() || !editingTask.description.trim()) {
      setError('Please provide both title and description.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${BASE_URL}/tasks/${editingTask._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          title: editingTask.title.trim(),
          description: editingTask.description.trim(),
          status: editingTask.status,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to update task');
      }

      setTasks((prev) =>
        prev.map((task) => (task._id === data.task._id ? data.task : task))
      );
      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (!user?.isAdmin) {
      setError('Only admin users can delete tasks.');
      return;
    }

    if (!window.confirm('Delete this task permanently?')) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete task');
      }

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    if (task.status === newStatus) return;
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Unable to update task status');
      }

      setTasks((prev) =>
        prev.map((current) => (current._id === data.task._id ? data.task : current))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const filteredTasks =
    statusFilter === 'all'
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
  const inProgressTasks = tasks.filter((task) => task.status === 'in progress').length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;

  return (
    <div className="d-flex justify-content-center">
      <Card className="shadow-sm w-100" style={{ maxWidth: '860px' }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <Card.Title>Task Dashboard</Card.Title>
              <Card.Subtitle className="text-muted">
                Signed in as {user?.email} {user?.isAdmin ? '(Admin)' : ''}
              </Card.Subtitle>
            </div>
            <Button variant="outline-secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {error && <Alert variant="danger">{error}</Alert>}

          <Row xs={1} md={2} className="g-3 mb-4">
            <Col>
              <Card className="h-100">
                <Card.Body>
                  <Card.Title className="h6">User summary</Card.Title>
                  <div className="mb-2">
                    <strong>{user?.email || 'Unknown user'}</strong>
                  </div>
                  <div className="text-muted mb-1">
                    Role: {user?.isAdmin ? 'Admin' : 'User'}
                  </div>
                  <div className="text-muted mb-1">Total tasks: {totalTasks}</div>
                  <div className="text-muted">Tracked since login session</div>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Row xs={2} className="g-3">
                <Col>
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <Card.Title className="h6">Pending</Card.Title>
                      <div className="fs-3">{pendingTasks}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <Card.Title className="h6">In progress</Card.Title>
                      <div className="fs-3">{inProgressTasks}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <Card.Title className="h6">Completed</Card.Title>
                      <div className="fs-3">{completedTasks}</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card className="h-100 text-center">
                    <Card.Body>
                      <Card.Title className="h6">Filtered</Card.Title>
                      <div className="fs-3">{filteredTasks.length}</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="h6">Create a new task</Card.Title>
              <Form onSubmit={handleCreateTask}>
                <Form.Group className="mb-3" controlId="taskTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="taskDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    required
                  />
                </Form.Group>

                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Create task'}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
            <span className="fw-semibold">Filter:</span>
            <Form.Select
              style={{ width: '200px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All statuses' : option}
                </option>
              ))}
            </Form.Select>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" role="status" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <Alert variant="secondary">No tasks found. Add a new task to get started.</Alert>
          ) : (
            <ListGroup>
              {filteredTasks.map((task) => (
                <ListGroup.Item key={task._id} className="mb-3">
                  {editingTask && editingTask._id === task._id ? (
                    <Form onSubmit={handleSaveEdit}>
                      <Form.Group className="mb-3" controlId="editTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask((prev) => ({ ...prev, title: e.target.value }))
                          }
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="editDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editingTask.description}
                          onChange={(e) =>
                            setEditingTask((prev) => ({ ...prev, description: e.target.value }))
                          }
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="editStatus">
                        <Form.Label>Status</Form.Label>
                        <Form.Select
                          value={editingTask.status}
                          onChange={(e) =>
                            setEditingTask((prev) => ({ ...prev, status: e.target.value }))
                          }
                        >
                          {statusOptions
                            .filter((item) => item !== 'all')
                            .map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex gap-2">
                        <Button type="submit" disabled={saving}>
                          Save changes
                        </Button>
                        <Button variant="secondary" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <Row className="align-items-center">
                        <Col>
                          <div className="d-flex justify-content-between flex-wrap gap-2">
                            <div>
                              <h5 className="mb-1">{task.title}</h5>
                              <p className="mb-2 text-muted">{task.description}</p>
                            </div>
                            <Badge
                              bg={
                                task.status === 'completed'
                                  ? 'success'
                                  : task.status === 'in progress'
                                  ? 'warning'
                                  : 'secondary'
                              }
                            >
                              {task.status}
                            </Badge>
                          </div>
                          <div className="text-muted small">
                            Created at: {new Date(task.createdAt).toLocaleString()}
                          </div>
                        </Col>
                        <Col xs="auto" className="d-flex gap-2 flex-wrap">
                          <Button size="sm" onClick={() => handleStartEdit(task)}>
                            Edit
                          </Button>
                          <Form.Select
                            size="sm"
                            value={task.status}
                            onChange={(e) => handleStatusChange(task, e.target.value)}
                          >
                            {statusOptions
                              .filter((item) => item !== 'all')
                              .map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                          </Form.Select>
                          {user?.isAdmin && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => handleDelete(task._id)}
                            >
                              Delete
                            </Button>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;
