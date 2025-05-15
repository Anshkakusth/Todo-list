import { useState, useEffect } from "react";
import { 
  AppBar, Toolbar, Typography, Container, Box, 
  TextField, Button, IconButton, Paper, Chip, 
  CircularProgress, CssBaseline
} from "@mui/material";
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Check as CheckIcon,
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
  AlignHorizontalRightRounded,
  CenterFocusStrong
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";

// Custom color grading
const colors = {
  light: {
    primary: "#2A7B9B",
    secondary: "#57C785",
    accent: "#9AD16F",
    background: "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 64%, rgba(83, 237, 124, 1) 100%)",
    card: "rgba(255, 255, 255, 0.9)",
    text: "#ffffff",
    chip: "rgba(13, 210, 190, 0.41)"
  },
  dark: {
    primary: "#020024",
    secondary: "#090979",
    accent: "#00d4ff",
    background: "linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 39%, rgba(0, 212, 255, 1) 100%)",
    card: "rgba(0, 0, 20, 0.85)",
    text: "#ffffff",
    chip: "rgba(0, 212, 255, 0.2)"
  }
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load todos
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
      setTodos(savedTodos);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Save todos
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false
      }]);
      setInput("");
    }
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <>
      <CssBaseline />
      <Box sx={{ 
        background: darkMode ? colors.dark.background : colors.light.background,
        minHeight: "100vh",
        paddingBottom: "2rem",
        transition: "background 0.5s ease"
      }}>
        {/* Gradient App Bar */}
        <AppBar position="static" sx={{ 
          background: darkMode 
            ? `linear-gradient(90deg, ${colors.dark.primary} 0%, ${colors.dark.secondary} 100%)`
            : `linear-gradient(90deg, ${colors.light.primary} 0%, ${colors.light.secondary} 100%)`,
          boxShadow: "none",
          borderBottom: '2px solidrgba(0, 0, 0, 0)'
        }}>
          <Toolbar>
            <Typography variant="h6" sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              letterSpacing: "1px",
              color: colors.light.text,
              textAlign: 'center'
            }}>
              Task App
            </Typography>
            <IconButton 
              onClick={() => setDarkMode(!darkMode)}
              color="inherit"
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ py: 4 }}>
  {/* Glass Card */}
  <Paper sx={{ 
    p: 3,
    background: darkMode ? colors.dark.card : colors.light.card,
    backdropFilter: "blur(8px)",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    border: darkMode ? "1px solid rgba(0, 212, 255, 0.3)" : "1px solid rgba(255, 255, 255, 0.3)"
  }}>
    {/* Input Section */}
    <Box sx={{ 
      display: "flex", 
      gap: 2, 
      mb: 4
    }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Add new task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && addTodo()}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            background: darkMode ? "rgba(2, 0, 36, 0.5)" : "rgba(255, 255, 255, 0.7)",
            "& fieldset": {
              borderColor: darkMode ? colors.dark.accent : colors.light.accent
            },
            "& input": {
              color: darkMode ? colors.dark.text : "#333333" // Using darker text for light mode input
            }
          },
          "& .MuiInputLabel-root": {
            color: darkMode ? colors.dark.text : "#333333"
          }
        }}
      />
      <Button 
        variant="contained" 
        onClick={addTodo}
        disabled={!input.trim()}
        sx={{
          minWidth: "56px",
          height: "56px",
          borderRadius: "8px",
          background: darkMode 
            ? `linear-gradient(45deg, ${colors.dark.secondary} 0%, ${colors.dark.accent} 100%)` 
            : `linear-gradient(45deg, ${colors.light.secondary} 0%, ${colors.light.accent} 100%)`,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
          },
          transition: "all 0.3s ease"
        }}
      >
        <AddIcon sx={{ color: colors.dark.text }} />
      </Button>
    </Box>

    {/* Filter Chips */}
    <Box sx={{ 
      display: "flex", 
      gap: 1, 
      mb: 3,
      flexWrap: "wrap"
    }}>
      <Chip 
        label={`All (${todos.length})`}
        onClick={() => setFilter("all")}
        variant={filter === "all" ? "outlined" : "filled"}
        sx={{
          background: filter === "all" ? 
            (darkMode ? colors.dark.chip : colors.light.chip) : "transparent",
          color: darkMode ? colors.dark.text : colors.light.primary,
          borderColor: darkMode ? colors.dark.accent : colors.light.accent
        }}
      />
      <Chip
        label={`Active (${activeCount})`}
        onClick={() => setFilter("active")}
        variant={filter === "active" ?"outlined" : "filled"}
        sx={{
          background: filter === "active" ? 
            (darkMode ? colors.dark.chip : colors.light.chip) : "transparent",
          color: darkMode ? colors.dark.text : colors.light.primary,
          borderColor: darkMode ? colors.dark.accent : colors.light.accent
        }}
      />
      <Chip
        label={`Completed (${todos.length - activeCount})`}
        onClick={() => setFilter("completed")}
        variant={filter === "completed" ? "outlined" : "filled" }
        sx={{
          background: filter === "completed" ? 
            (darkMode ? colors.dark.chip : colors.light.chip) : "transparent",
          color: darkMode ? colors.dark.text : colors.light.primary,
          borderColor: darkMode ? colors.dark.accent : colors.light.accent
        }}
      />
    </Box>

    {/* Todo List */}
    {isLoading ? (
      <Box sx={{ 
        display: "flex", 
        justifyContent: "center", 
        py: 4
      }}>
        <CircularProgress sx={{ 
          color: darkMode ? colors.dark.accent : colors.light.accent 
        }} />
      </Box>
    ) : (
      <AnimatePresence>
        {filteredTodos.length === 0 ? (
          <Box sx={{ 
            textAlign: "center", 
            py: 4,
            color: darkMode ? colors.dark.text : colors.light.primary
          }}>
            <Typography variant="h6">
              {filter === "completed" 
                ? "No completed tasks yet" 
                : "Nothing to do! Add a task"}
            </Typography>
          </Box>
        ) : (
          filteredTodos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              layout
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Paper
                sx={{
                  p: 2,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  background: darkMode 
                    ? "rgba(2, 0, 36, 0.6)" 
                    : "rgba(255, 255, 255, 0.8)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)"
                  },
                  borderLeft: `4px solid ${todo.completed 
                    ? (darkMode ? colors.dark.accent : colors.light.accent) 
                    : (darkMode ? colors.dark.secondary : colors.light.secondary)}`
                }}
              >
                <IconButton
                  onClick={() => toggleComplete(todo.id)}
                  sx={{
                    background: todo.completed 
                      ? (darkMode ? colors.dark.accent : colors.light.accent) 
                      : "transparent",
                    border: `2px solid ${darkMode ? colors.dark.accent : colors.light.accent}`,
                    mr: 2,
                    "&:hover": {
                      background: todo.completed 
                        ? (darkMode ? "#00b4e6" : "#7bc67e") 
                        : "rgba(0, 0, 0, 0.04)"
                    }
                  }}
                >
                  <CheckIcon sx={{ 
                    color: todo.completed 
                      ? colors.dark.text 
                      : (darkMode ? colors.dark.accent : colors.light.accent)
                  }} />
                </IconButton>
                <Typography 
                  sx={{ 
                    flexGrow: 1,
                    color: darkMode ? colors.dark.text : "#333333",
                    textDecoration: todo.completed ? "line-through" : "none",
                    opacity: todo.completed ? 0.7 : 1
                  }}
                >
                  {todo.text}
                </Typography>
                <IconButton 
                  onClick={() => deleteTodo(todo.id)}
                  sx={{
                    color: darkMode ? "#ff6b6b" : "#ff4757",
                    "&:hover": {
                      background: "rgba(255, 71, 87, 0.1)"
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    )}
  </Paper>
</Container>
      </Box>
    </>
  );
};

export default App;
