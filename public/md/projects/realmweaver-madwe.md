# RealmWeaver-AI (MADWE): a four-agent diffusion world engine

Game worlds built by four generative agents and rendered in Unity.

- Problem: A game world needs terrain, assets, characters and story that fit together.
- What was done: Led architecture and integration: four agents on a shared world state graph, connected to Unity over named-pipe IPC.
- What changed: The Day 8 monitor measured about 19 to 28 FPS against a 30 FPS target, about 35 to 49 ms per frame.

> Four agents share a neural world state graph: environment (VAE plus diffusion), assets (Stable Diffusion 1.5 with LoRA adapters per biome), characters (GAN plus RNN) and narrative (fine-tuned GPT-J). Unity renders the world.

- Kind: Generative AI
- Period: 2025 (completed)
- Role: Architecture and Integration Lead
- Team: Ankit Gole with Shreya Boyane
- Repository: https://github.com/Sonica-B/RealmWeaver-MADWE

## Problem

Generating a playable world means terrain, assets, characters and narrative have to agree with each other and reach the game engine in time.

## Approach

Four agents share a neural world state graph. Wave Function Collapse assembles the tilemaps. The asset agent uses Stable Diffusion 1.5 with LoRA at rank 8, fp16 and gradient checkpointing, and is the only part that uses LangGraph. Unity talks to the agents over named-pipe IPC.

## Results

- Led architecture and integration of four agents on a shared world state graph.
- Connected the agents to Unity over named-pipe IPC.
- Measured about 19 to 28 FPS against a 30 FPS target on Day 8.
- Frame time ran about 35 to 49 ms.
- Memory held at about 6.0 to 6.5 GB of an 8 GB limit.
- Agents exchanged about 190 to 300 messages per second against a 200 target.

## Key numbers

- Frame rate on Day 8, 30 FPS target: about 19 to 28 FPS
- Frame time: about 35 to 49 ms
- Memory, 8 GB limit: about 6.0 to 6.5 GB
- Agent messages per second, 200 target: about 190 to 300

## Stack

Stable Diffusion 1.5, LoRA, GPT-J, VAE, GAN, Wave Function Collapse, Unity, LangGraph

Canonical page: https://ankitgole.dev/projects/realmweaver-madwe. This markdown: https://ankitgole.dev/md/projects/realmweaver-madwe.md. Written by Ankit Gole; generated from the site content model, last updated 2026-11-23.
