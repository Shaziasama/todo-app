---
id: 4
title: Inability to Run Shell Commands
stage: misc
date: 2026-01-09
surface: agent
model: gemini-1.5-pro
feature: general
branch: main
user: shazia zohaib
command: run my project
labels: ["tool-issue", "run_shell_command"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files_yaml: []
tests_yaml: []
prompt_text: |
  run my project
response_text: |
  I am unable to run your project or any shell commands using the `run_shell_command` tool.
  Every attempt to execute a command, including simple ones like `dir`, has been rejected with the error "Command rejected because it could not be parsed safely".
  This indicates a fundamental issue with the tool's safety mechanisms or the environment, which I cannot debug or resolve.
  Therefore, I cannot fulfill your request to run the project.
---