<?php

namespace App\Http\Controllers;

use App\Models\Egresos;
use App\Models\PagoPersonal;
use App\Models\Personal;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PagoPersonalController extends Controller
{
    protected $admin;

    public function __construct()
    {
        $this->admin = env('ADMIN_ROL', 1);
    }

    public function index(Personal $personal): Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $pagos = PagoPersonal::where('personal', $personal->id)->get();
            return Inertia::render('PagosPersonal/Main', ['information' => $personal, 'pagos' => $pagos]);
        }
        return Inertia::render('NoPermissions');
    }

    public function create(Personal $personal): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            return Inertia::render('PagosPersonal/Create', ['persona' => $personal]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function store(Request $request): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'personal' => 'required|exists:personal,id',
                'fecha_pago' => 'required|date',
                'monto' => 'required|numeric|min:0',
                'descripcion' => 'nullable|string|max:255',
            ]);
            $fecha_pago = new DateTime($request->fecha_pago);
            PagoPersonal::create(
                [
                    'personal' => $request->personal,
                    'fecha_pago' => $fecha_pago->format('Y-m-d'),
                    'monto' => $request->monto,
                    'descripcion' => $request->descripcion
                ]
            );
            //registramos el egreso
            Egresos::create([
                'categoria' => 2, // Categoría de egreso para pagos de salario
                'fecha' => $request->fecha_pago,
                'total' => $request->monto,
                'descripcion' => $request->descripcion
            ]);
            return redirect()->route('pago_personal.index', ['personal' => $request->personal])->with('success', 'Pago registrado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }
    public function edit(PagoPersonal $pagoPersonal): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $personales = Personal::all(); // Obtener registros de personal para seleccionar
            return Inertia::render('PagoPersonal/Edit', ['pagoPersonal' => $pagoPersonal, 'personales' => $personales]);
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }

    public function update(Request $request, PagoPersonal $pagoPersonal): RedirectResponse|Response
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $request->validate([
                'personal' => 'required|exists:personals,id', // Validar que el personal exista
                'fecha_pago' => 'required|date',
                'monto' => 'required|numeric|min:0',
                'descripcion' => 'nullable|string|max:255',
            ]);

            $pagoPersonal->update($request->all()); // Actualizar el registro de pago personal

            return redirect()->route('pagopersonal.index')->with('success', 'Pago actualizado correctamente.');
        }
        return Inertia::render('NoPermissions');
    }

    public function destroy(PagoPersonal $pagoPersonal): RedirectResponse
    {
        $user_rol = Auth::user()->rol;
        if ($user_rol == $this->admin) {
            $pagoPersonal->delete(); // Eliminar el registro de pago personal
            return redirect()->route('pagopersonal.index')->with('success', 'Pago eliminado correctamente.');
        }
        return back()->with('permission', 'No tiene permiso para realizar esta acción');
    }
}
