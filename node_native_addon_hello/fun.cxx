#include <cmath>
#include <stdint.h>
#include <nan.h>

void Pow(const Nan::FunctionCallbackInfo<v8::Value>& args) {
	v8::Isolate* isolate = args.GetIsolate();
	v8::Local<v8::Context> context = isolate->GetCurrentContext();

	if (args.Length() < 2) {
		Nan::ThrowTypeError("Wrong number of arguments");
		return;
	}

	if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
		Nan::ThrowTypeError("Both arguments should be numbers");
		return;
	}

	double arg0 = args[0]->NumberValue(context).FromMaybe(0);
	double arg1 = args[1]->NumberValue(context).FromMaybe(0);
	v8::Local<v8::Number> result = Nan::New(pow(arg0, arg1));

	args.GetReturnValue().Set(result);
}

uint32_t x;

uint32_t next(void) {
  uint32_t z = (x += 0x6D2B79F5UL);
  z = (z ^ (z >> 15)) * (z | 1UL);
  z ^= z + (z ^ (z >> 7)) * (z | 61UL);
  return z ^ (z >> 14);
}

void Mulberry32_Seed(const Nan::FunctionCallbackInfo<v8::Value>& args) {
	v8::Isolate* isolate = args.GetIsolate();
	v8::Local<v8::Context> context = isolate->GetCurrentContext();

	if (args.Length() < 1) {
		Nan::ThrowTypeError("Usage: Mulberry32_Seed(n)");
		return;
	}

	if (!args[0]->IsNumber()) {
		Nan::ThrowTypeError("Usage: Mulberry32_Seed(n)");
		return;
	}

	double arg0 = args[0]->NumberValue(context).FromMaybe(0);
	x = (int) arg0;
}

void Mulberry32_Next(const Nan::FunctionCallbackInfo<v8::Value>& args) {
	v8::Local<v8::Number> result = Nan::New(next());

	args.GetReturnValue().Set(result);
}

void Init(v8::Local<v8::Object> exports) {
	v8::Local<v8::Context> context = exports->CreationContext();

	exports->Set(context, Nan::New("pow").ToLocalChecked(),
				 Nan::New<v8::FunctionTemplate>(Pow)->GetFunction(context).ToLocalChecked());

	exports->Set(context, Nan::New("seed").ToLocalChecked(),
				 Nan::New<v8::FunctionTemplate>(Mulberry32_Seed)->GetFunction(context).ToLocalChecked());

	exports->Set(context, Nan::New("next").ToLocalChecked(),
				 Nan::New<v8::FunctionTemplate>(Mulberry32_Next)->GetFunction(context).ToLocalChecked());
}

NODE_MODULE(pow, Init)
