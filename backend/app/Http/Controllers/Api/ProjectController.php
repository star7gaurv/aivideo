<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = Project::where('user_id', auth()->id())
            ->orderByDesc('updated_at')
            ->paginate(15);

        return response()->json($projects);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'format'      => 'required|in:landscape,portrait,ad',
            'template_id' => 'required|string|max:64',
            'config'      => 'nullable|array',
        ]);

        $project = Project::create([
            ...$data,
            'user_id' => auth()->id(),
            'status'  => 'draft',
        ]);

        return response()->json($project, 201);
    }

    public function show(string $id): JsonResponse
    {
        $project = Project::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        return response()->json($project);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $project = Project::where('id', $id)->where('user_id', auth()->id())->firstOrFail();

        $data = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'format'      => 'sometimes|in:landscape,portrait,ad',
            'template_id' => 'sometimes|string|max:64',
            'config'      => 'sometimes|array',
            'status'      => 'sometimes|in:draft,rendering,done,failed',
        ]);

        $project->update($data);
        return response()->json($project);
    }

    public function destroy(string $id): JsonResponse
    {
        $project = Project::where('id', $id)->where('user_id', auth()->id())->firstOrFail();
        $project->delete();
        return response()->json(null, 204);
    }
}
