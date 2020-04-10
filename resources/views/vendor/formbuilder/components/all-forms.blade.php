<div class="container">	
	<h2>All Forms</h2>

	<div class="form_list-body">

		@if($forms->count())
		@foreach($forms as $form)
		<div class="form_list-item">
			<div class="form_list-item--info">
				<div class="form_list-item--last_update">{{ $form->updated_at }}</div>
				<div class="form_list-item--img">
					<img src="{{ asset('img/Website-Brief.jpg') }}">
				</div>
				<div class="form_list-item--title">{{ $form->name }}</div>
				<div class="form_list-item--submission_count">{{ $form->submissions_count }} views</div>
			</div>
			<div class="form_list-item--settings">
				<a href="{{ route('formbuilder::forms.submissions.index', $form) }}" class="btn btn-primary btn-sm" title="View submissions for form '{{ $form->name }}'">
					<i class="fa fa-th-list"></i> Data
				</a>
				<a href="{{ route('formbuilder::forms.show', $form) }}" class="btn btn-primary btn-sm" title="Preview form '{{ $form->name }}'">
					<i class="fa fa-eye"></i> 
					Show
				</a> 
				<a href="{{ route('formbuilder::forms.edit', $form) }}" class="btn btn-primary btn-sm" title="Edit form">
					<i class="fa fa-pencil"></i> 
					Edit
				</a> 
				<button class="btn btn-primary btn-sm clipboard" data-clipboard-text="{{ route('formbuilder::form.render', $form->identifier) }}" data-message="" data-original="" title="Copy form URL to clipboard">
					<i class="fa fa-clipboard"></i> 
					Copy
				</button> 

				<form action="{{ route('formbuilder::forms.destroy', $form) }}" method="POST" id="deleteFormForm_{{ $form->id }}" class="d-inline-block">
					@csrf 
					@method('DELETE')

                    <input type="hidden" name="hubspot_guid" id="hubspot_guid" value="{{$form->hubspot_guid}}">
                	<input type="hidden" name="form_action" id="form_action" value="deleteForm">


					<button type="submit" class="btn btn-danger btn-sm confirm-form" data-form="deleteFormForm_{{ $form->id }}" data-message="Delete form '{{ $form->name }}'?" title="Delete form '{{ $form->name }}'">
						<i class="fa fa-trash-o"></i> 
						Delete
					</button>
				</form>
			</div>
		</div>
		@endforeach
	</div>

	@if($forms->hasPages())
	<div class="card-footer mb-0 pb-0">
		<div>{{ $forms->links() }}</div>
	</div>
	@endif
	@else
	<div class="card-body">
		<h4 class="text-danger text-center">
			No form to display.
		</h4>
	</div>  
	@endif

</div>